import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProfile, getAvailability } from '@/data/profile';
import { useProfile } from '@/contexts/ProfileContext';
import { stagger, fadeUp } from '@/utils/animations';

interface HeroProps { onContactClick: () => void; }

const scaleInDelayed: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { delay: 0.1, type: 'spring' as const, stiffness: 120 } },
};

export function Hero({ onContactClick }: HeroProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const activeProfile = useProfile();
  const profile = getProfile(lang);
  const availability = getAvailability(lang);

  // Override du tagline si le profil actif en définit un
  const headline =
    (lang === 'en' ? activeProfile.hero?.tagline_en : activeProfile.hero?.tagline)
    ?? activeProfile.hero?.tagline
    ?? profile.headline;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  const orb1X = useTransform(smx, [-0.5, 0.5], [-40, 40]);
  const orb1Y = useTransform(smy, [-0.5, 0.5], [-25, 25]);
  const orb2X = useTransform(smx, [-0.5, 0.5], [25, -25]);
  const orb2Y = useTransform(smy, [-0.5, 0.5], [20, -20]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <motion.div className="hero__orb hero__orb--1" style={{ x: orb1X, y: orb1Y }} />
        <motion.div className="hero__orb hero__orb--2" style={{ x: orb2X, y: orb2Y }} />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        {availability.available && (
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="hero__badge-dot" />
            {availability.label} · {availability.type}
          </motion.div>
        )}

        <motion.div
          className="hero__content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="hero__photo-wrap" variants={scaleInDelayed}>
            <img
              src={profile.photoUrl}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="hero__photo"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=7c3aed&color=fff&size=200`;
              }}
            />
            <div className="hero__photo-ring" />
          </motion.div>

          <div className="hero__text">
            <motion.p className="hero__greeting" variants={fadeUp}>{t('hero.greeting')}</motion.p>
            <motion.h1 className="hero__name" variants={fadeUp}>
              {profile.firstName}{' '}
              <span className="gradient-text">{profile.lastName}</span>
            </motion.h1>
            <motion.p className="hero__headline" variants={fadeUp}>{headline}</motion.p>
            <motion.p className="hero__summary" variants={fadeUp}>{profile.summary}</motion.p>
            <motion.div className="hero__actions" variants={fadeUp}>
              <button className="btn btn--primary" onClick={onContactClick} data-hover>
                <i className="bi bi-chat-dots" /> {t('nav.contact')}
              </button>
              <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" data-hover>
                <i className="bi bi-linkedin" /> LinkedIn
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="hero__scroll"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <i className="bi bi-chevron-double-down" />
        </motion.div>
      </div>
    </section>
  );
}
