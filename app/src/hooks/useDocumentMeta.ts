import { useEffect } from 'react';
import cvData from '../../cv.json';

interface DocumentMetaOptions {
  lang?: string;
}

/**
 * Updates document.title and meta description based on cv.json data.
 * Call once from the root page component.
 */
export function useDocumentMeta({ lang = 'fr' }: DocumentMetaOptions = {}) {
  useEffect(() => {
    const { firstName, lastName, headline } = cvData.basics;
    const name = `${firstName} ${lastName}`.trim();

    const titleEn = `${name} — Full Stack Developer`;
    const titleFr = `${name} — Développeur Full Stack`;
    const title = lang === 'en' ? titleEn : titleFr;

    const descEn = `Interactive CV — ${headline}. Contact via GitHub Issues.`;
    const descFr = `CV interactif — ${headline}. Contact via GitHub Issues.`;
    const description = lang === 'en' ? descEn : descFr;

    document.title = title;

    const setMeta = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);

    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'fr');
  }, [lang]);
}
