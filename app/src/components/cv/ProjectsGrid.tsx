import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjects } from '@/data/profile';
import { useProfile } from '@/contexts/ProfileContext';
import type { Project } from '@/types';


function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

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
      className='project-card'
      style={{ rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
    >
      <div className='project-card__header'>
        <h3 className='project-card__title'>{project.title}</h3>
        <div className='project-card__links'>
          {project.githubUrl && (
            <a href={project.githubUrl} target='_blank' rel='noopener noreferrer' className='project-card__link' data-hover='true'>
              {project.stars && <span className='project-card__stars'><i className='bi bi-star-fill' /> {project.stars}</span>}
              <i className='bi bi-github' />
            </a>
          )}
          {project.url && (
            <a href={project.url} target='_blank' rel='noopener noreferrer' className='project-card__link' data-hover='true'>
              <i className='bi bi-box-arrow-up-right' />
            </a>
          )}
        </div>
      </div>
      <p className='project-card__desc'>{project.description}</p>
      {project.impact && (
        <div className='project-card__impact'>
          <i className='bi bi-lightning-charge-fill' /> {project.impact}
        </div>
      )}
      <div className='project-card__tags'>
        {project.technologies.map((tech) => <span key={tech} className='tag'>{tech}</span>)}
      </div>
    </motion.article>
  );
}

export function ProjectsGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const activeProfile = useProfile();
  const projects = getProjects(lang, activeProfile.filter);

  return (
    <section id='projects' className='section' ref={ref}>
      <div className='container'>
        <motion.p className='section__label' initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.projects.label')}
        </motion.p>
        <motion.h2 className='section__title' initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
          {t('sections.projects.title')}
        </motion.h2>
        <div className='projects__grid'>
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
