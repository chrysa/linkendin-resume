"""
Veille automatisée : solutions d'accès aux données LinkedIn.

Sources surveillées :
- HackerNews (Algolia API) : discussions récentes sur "linkedin api"
- GitHub Search API : nouveaux dépôts linkedin scraping/API (créés dans les 7 derniers jours)
- PyPI RSS : nouvelles publications de paquets LinkedIn

Le script crée ou met à jour une GitHub Issue de suivi si du contenu pertinent est trouvé.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


KEYWORDS = ["linkedin api", "linkedin scraping", "linkedin data export", "linkedin profile api"]
GITHUB_TOPICS = ["linkedin-api", "linkedin-scraper", "linkedin-python"]
ISSUE_TITLE = "🔍 [Veille] Solutions accès données LinkedIn"
ISSUE_LABEL = "veille"


def fetch_json(url: str, headers: dict[str, str] | None = None) -> dict | list | None:
    req = Request(url, headers=headers or {})
    try:
        with urlopen(req, timeout=10) as resp:  # noqa: S310
            return json.loads(resp.read().decode())
    except (HTTPError, URLError, json.JSONDecodeError):
        return None


def search_hackernews(query: str, days: int = 7) -> list[dict]:
    """Retourne les hits HN des 7 derniers jours pour une requête."""
    since = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
    url = (
        f"https://hn.algolia.com/api/v1/search_by_date"
        f"?query={quote(query)}&tags=story,comment&numericFilters=created_at_i>{since}&hitsPerPage=5"
    )
    data = fetch_json(url)
    if not data or "hits" not in data:
        return []
    return [
        {
            "title": h.get("title") or h.get("comment_text", "")[:100],
            "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
            "points": h.get("points", 0),
            "date": h.get("created_at", ""),
        }
        for h in data["hits"]
        if h.get("title") or h.get("comment_text")
    ]


def search_github_repos(topic: str, days: int = 7) -> list[dict]:
    """Retourne les dépôts GitHub créés récemment pour un topic."""
    since = (datetime.now(tz=timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    url = (
        f"https://api.github.com/search/repositories"
        f"?q=topic:{quote(topic)}+created:>{since}&sort=stars&order=desc&per_page=5"
    )
    token = os.getenv("GH_TOKEN", "")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = fetch_json(url, headers)
    if not data or "items" not in data:
        return []
    return [
        {
            "name": r["full_name"],
            "url": r["html_url"],
            "description": r.get("description", ""),
            "stars": r.get("stargazers_count", 0),
        }
        for r in data["items"]
    ]


def search_pypi(query: str) -> list[dict]:
    """Retourne les paquets PyPI correspondant à la recherche."""
    url = f"https://pypi.org/search/?q={quote(query)}&format=json"
    # PyPI n'a pas d'API de recherche publique JSON, on utilise le feed RSS
    rss_url = f"https://pypi.org/rss/search/?q={quote(query)}&classifier=Topic+%3A%3A+Internet"
    req = Request(rss_url)
    try:
        with urlopen(req, timeout=10) as resp:  # noqa: S310
            content = resp.read().decode()
    except (HTTPError, URLError):
        return []

    # Parse RSS basique sans dépendances
    items = []
    for chunk in content.split("<item>")[1:6]:
        title = _extract_tag(chunk, "title")
        link = _extract_tag(chunk, "link")
        desc = _extract_tag(chunk, "description")
        if title and link:
            items.append({"name": title, "url": link, "description": desc})
    return items


def _extract_tag(text: str, tag: str) -> str:
    start = text.find(f"<{tag}>") + len(tag) + 2
    end = text.find(f"</{tag}>")
    if start < len(tag) + 2 or end < 0:
        return ""
    return text[start:end].strip().strip("<![CDATA[").strip("]]>").strip()


def find_or_create_issue(repo: str, token: str, title: str, body: str) -> str:
    """Crée ou met à jour l'issue de veille, retourne son URL."""
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # Chercher une issue existante ouverte avec ce titre
    search_url = f"https://api.github.com/repos/{repo}/issues?state=open&per_page=50"
    existing = fetch_json(search_url, headers) or []
    issue_number = None
    for issue in existing:
        if isinstance(issue, dict) and issue.get("title") == title:
            issue_number = issue["number"]
            break

    if issue_number:
        # Ajouter un commentaire
        url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
        payload = json.dumps({"body": body}).encode()
        req = Request(url, data=payload, headers={**headers, "Content-Type": "application/json"})
        with urlopen(req, timeout=10) as resp:  # noqa: S310
            data = json.loads(resp.read().decode())
        return data.get("html_url", "")
    else:
        # Créer l'issue (avec label si possible)
        url = f"https://api.github.com/repos/{repo}/issues"
        payload = json.dumps({"title": title, "body": body, "labels": [ISSUE_LABEL]}).encode()
        req = Request(url, data=payload, headers={**headers, "Content-Type": "application/json"})
        try:
            with urlopen(req, timeout=10) as resp:  # noqa: S310
                data = json.loads(resp.read().decode())
        except HTTPError:
            # Retry sans label si le label n'existe pas
            payload = json.dumps({"title": title, "body": body}).encode()
            req = Request(url, data=payload, headers={**headers, "Content-Type": "application/json"})
            with urlopen(req, timeout=10) as resp:  # noqa: S310
                data = json.loads(resp.read().decode())
        return data.get("html_url", "")


def build_report(
    hn_results: dict[str, list],
    gh_results: dict[str, list],
    pypi_results: list,
    run_date: str,
) -> str:
    lines = [f"## Rapport de veille — {run_date}\n"]

    # HackerNews
    lines.append("### HackerNews")
    total_hn = sum(len(v) for v in hn_results.values())
    if total_hn == 0:
        lines.append("_Aucune discussion notable cette semaine._\n")
    else:
        for query, hits in hn_results.items():
            if hits:
                lines.append(f"\n**`{query}`**")
                for h in hits:
                    lines.append(f"- [{h['title'][:80]}]({h['url']}) — {h['points']} pts — {h['date'][:10]}")
        lines.append("")

    # GitHub
    lines.append("### GitHub — nouveaux dépôts")
    total_gh = sum(len(v) for v in gh_results.values())
    if total_gh == 0:
        lines.append("_Aucun nouveau dépôt cette semaine._\n")
    else:
        for topic, repos in gh_results.items():
            if repos:
                lines.append(f"\n**topic: `{topic}`**")
                for r in repos:
                    desc = f" — {r['description'][:60]}" if r["description"] else ""
                    lines.append(f"- [{r['name']}]({r['url']}) ⭐{r['stars']}{desc}")
        lines.append("")

    # PyPI
    lines.append("### PyPI — paquets récents")
    if not pypi_results:
        lines.append("_Aucun paquet notable._\n")
    else:
        for p in pypi_results:
            desc = f" — {p['description'][:60]}" if p["description"] else ""
            lines.append(f"- [{p['name']}]({p['url']}){desc}")
        lines.append("")

    lines.append("---")
    lines.append(
        "_Veille automatique — [workflow](/.github/workflows/linkedin-watch.yml). "
        "Fermer cette issue quand le blocage est levé._"
    )
    return "\n".join(lines)


def main() -> None:
    repo = os.getenv("GH_REPO", "")
    token = os.getenv("GH_TOKEN", "")
    run_date = datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")

    print(f"[veille] Démarrage — {run_date}")

    hn_results: dict[str, list] = {}
    for kw in KEYWORDS:
        hits = search_hackernews(kw)
        hn_results[kw] = hits
        print(f"  HN '{kw}': {len(hits)} résultats")

    gh_results: dict[str, list] = {}
    for topic in GITHUB_TOPICS:
        repos = search_github_repos(topic)
        gh_results[topic] = repos
        print(f"  GitHub topic '{topic}': {len(repos)} résultats")

    pypi_results = search_pypi("linkedin")
    print(f"  PyPI 'linkedin': {len(pypi_results)} résultats")

    has_results = (
        any(hn_results.values())
        or any(gh_results.values())
        or pypi_results
    )

    report = build_report(hn_results, gh_results, pypi_results, run_date)

    if not repo or not token:
        print("\n[veille] GH_REPO / GH_TOKEN manquants — affichage local uniquement\n")
        print(report)
        sys.exit(0)

    print(f"[veille] {'Résultats trouvés' if has_results else 'Aucun résultat'} — mise à jour de l'issue GitHub")
    issue_url = find_or_create_issue(repo, token, ISSUE_TITLE, report)
    print(f"[veille] Issue : {issue_url}")


if __name__ == "__main__":
    main()
