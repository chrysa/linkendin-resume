import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjects, GITHUB_CONFIG } from '@/data/profile';
import { useProfile } from '@/contexts/ProfileContext';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import type { Project } from '@/types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { t } = useTranslation();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sRotateX = useSpring(rotateX, { stiffness: 280, damping: 28 });
  const sRotateY = useSpring(rotateY, { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rotateX.set(((e.clientY - rect.top) / rect.height - 0.5) * 14);
    rotateY.set(((rect.left + rect.width / 2 - e.clientX) / (rect.width / 2)) * 10);
  };

  return (
    <motion.article
      ref={ref}
      className="project-card"
      style={{ rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <div className="project-card__header">
        <h3 className="project-card__title">{project.title}</h3>
        <div className="project-card__links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              data-hover="true"
              aria-label={t('sections.projects.githubLink', { title: project.title })}
            >
              {project.stars && (
                <span className="project-card__stars" aria-hidden="true">
                  <i className="bi bi-star-fill" aria-hidden="true" /> {project.stars}
                </span>
              )}
              <i className="bi bi-github" aria-hidden="true" />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              data-hover="true"
              aria-label={t('sections.projects.demoLink', { title: project.title })}
            >
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <p className="project-card__desc">{project.description}</p>
      {project.impact && (
        <div className="project-card__impact">
          <i className="bi bi-lightning-charge-fill" aria-hidden="true" /> {project.impact}
        </div>
      )}
      <div className="project-card__tags">
        {project.technologies.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function GitHubCard({ repo, index }: Readonly<{ repo: import('@/hooks/useGitHubRepos').GitHubRepo; index: number }>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sRotateX = useSpring(rotateX, { stiffness: 280, damping: 28 });
  const sRotateY = useSpring(rotateY, { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotateX.set(((e.clientY - r.top) / r.height - 0.5) * 14);
    rotateY.set(((r.left + r.width / 2 - e.clientX) / (r.width / 2)) * 10);
  };

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      style={{ rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      aria-label={`${repo.name} on GitHub (opens in new tab)`}
      data-hover="true"
    >
      <div className="project-card__header">
        <h3 className="project-card__title">{repo.name}</h3>
        <div className="project-card__links">
          {repo.stargazers_count > 0 && (
            <span className="project-card__stars" aria-label={`${repo.stargazers_count} stars`}>
              <i className="bi bi-star-fill" aria-hidden="true" /> {repo.stargazers_count}
            </span>
          )}
          <i className="bi bi-github project-card__gh-icon" aria-hidden="true" />
        </div>
      </div>
      {repo.description && <p className="project-card__desc">{repo.description}</p>}
      <div className="project-card__tags project-card__tags--push">
        {repo.language && <span className="tag">{repo.language}</span>}
        {repo.topics.slice(0, 3).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="project-card__updated">
        <i className="bi bi-clock" aria-hidden="true" /> {formatRelative(repo.pushed_at)}
      </div>
    </motion.a>
  );
}

export function ProjectsGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const activeProfile = useProfile();
  const staticProjects = getProjects(lang, activeProfile.filter);
  const { repos, loading } = useGitHubRepos({ owner: GITHUB_CONFIG.owner });

  // GitHub contribution graph URL (ghchart service — public SVG embed)
  const graphUrl = `https://ghchart.rshah.org/7c3aed/${GITHUB_CONFIG.owner}`;

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <motion.p className="section__label" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.projects.label')}
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {t('sections.projects.title')}
        </motion.h2>

        {/* Contribution graph */}
        <motion.div
          className="github-graph"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 0.85, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          aria-label={t('sections.projects.contributionGraph')}
        >
          <img
            src={graphUrl}
            alt={t('sections.projects.contributionGraph')}
            className="github-graph__img"
            loading="lazy"
          />
        </motion.div>

        {/* Static highlighted projects */}
        <div className="projects__grid projects__grid--spaced">
          {staticProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Live GitHub repos */}
        {(loading || repos.length > 0) && (
          <>
            <motion.h3
              className="projects__sub-title"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {t('sections.projects.liveTitle')}
            </motion.h3>
            <div className="projects__grid">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={`sk-${i}`} className="project-card project-card--skeleton" aria-hidden="true">
                      <div className="skeleton skeleton--title" />
                      <div className="skeleton skeleton--text" />
                      <div className="skeleton skeleton--text skeleton--short" />
                    </div>
                  ))
                : repos.map((repo, i) => <GitHubCard key={repo.id} repo={repo} index={i} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
