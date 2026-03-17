import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/data/profile';
import { stagger, fadeUp } from '@/utils/animations';

export function ContactSection({ onContactClick }: { onContactClick: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const profile = getProfile(lang);

  return (
    <section id='contact' className='section contact-section' ref={ref}>
      <div className='contact-section__bg' aria-hidden='true'>
        <div className='hero__orb hero__orb--1' style={{ opacity: 0.25 }} />
        <div className='hero__orb hero__orb--2' style={{ opacity: 0.15 }} />
      </div>
      <div className='container contact-section__inner'>
        <motion.div variants={stagger} initial='hidden' animate={inView ? 'show' : 'hidden'}>
          <motion.p className='section__label' variants={fadeUp}>{t('sections.contact.label')}</motion.p>
          <motion.h2 className='section__title contact-section__title' variants={fadeUp}>
            {t('sections.contact.titleLine1')}<br />
            <span className='gradient-text'>{t('sections.contact.titleLine2')}</span>
          </motion.h2>
          <motion.p className='contact-section__sub' variants={fadeUp}>{t('sections.contact.sub')}</motion.p>
          <motion.div className='contact-section__cta' variants={fadeUp}>
            <button className='btn btn--primary btn--lg' onClick={onContactClick} data-hover='true'>
              <i className='bi bi-chat-dots-fill' /> {t('sections.contact.cta')}
            </button>
            <a href={profile.profileUrl} target='_blank' rel='noopener noreferrer' className='btn btn--ghost btn--lg' data-hover='true'>
              <i className='bi bi-linkedin' /> {t('sections.contact.linkedin')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
