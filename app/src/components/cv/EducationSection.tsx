import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/data/profile';
import { stagger, slideLeft } from '@/utils/animations';

export function EducationSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const profile = getProfile(lang);

  return (
    <section id='education' className='section section--dark' ref={ref}>
      <div className='container'>
        <motion.p className='section__label' initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.education.label')}
        </motion.p>
        <motion.h2 className='section__title' initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
          {t('sections.education.title')}
        </motion.h2>
        <motion.div className='education__list' variants={stagger} initial='hidden' animate={inView ? 'show' : 'hidden'}>
          {profile.educations.map((edu, i) => (
            <motion.div key={i} className='edu-card' variants={slideLeft} whileHover={{ x: 6 }}>
              <div className='edu-card__years'>{edu.startYear} — {edu.endYear}</div>
              <div className='edu-card__body'>
                <h3 className='edu-card__degree'>{edu.degree} · {edu.fieldOfStudy}</h3>
                <p className='edu-card__school'>{edu.school}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
