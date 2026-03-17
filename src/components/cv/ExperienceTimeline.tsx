import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/data/profile';
import { useProfile } from '@/contexts/ProfileContext';
import type { Position } from '@/types/linkedin';


function formatDate(d: { month: number; year: number }, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    new Date(d.year, d.month - 1),
  );
}

function ExpCard({ position, index, lang }: { position: Position; index: number; lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const { t } = useTranslation();

  return (
    <motion.div
      ref={ref}
      className='exp-card'
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='exp-card__dot' />
      <div className='exp-card__body'>
        <div className='exp-card__header'>
          <div>
            <h3 className='exp-card__title'>{position.title}</h3>
            <p className='exp-card__company'>{position.company} · {position.location}</p>
          </div>
          <time className='exp-card__date'>
            {formatDate(position.startDate, locale)} — {position.endDate ? formatDate(position.endDate, locale) : t('sections.experience.present')}
          </time>
        </div>
        <p className='exp-card__desc'>{position.description}</p>
        {position.technologies && (
          <div className='exp-card__tags'>
            {position.technologies.map((tech) => (
              <span key={tech} className='tag'>{tech}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const activeProfile = useProfile();
  const profile = getProfile(lang, activeProfile.filter);

  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 90%', 'end 70%'] });
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    <section id='experiences' className='section' ref={sectionRef}>
      <div className='container'>
        <motion.p className='section__label' initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.experience.label')}
        </motion.p>
        <motion.h2 className='section__title' initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
          {t('sections.experience.title')}
        </motion.h2>
        <div className='timeline' ref={timelineRef}>
          <motion.div className='timeline__line' style={{ scaleY: lineScaleY, originY: 0 }} />
          {profile.positions.map((pos, i) => (
            <ExpCard key={i} position={pos} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
