import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { getProfile } from '@/data/profile';

export function Navbar({ onContactClick }: { onContactClick: () => void }) {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const profile = getProfile(lang);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navKeys = ['impact', 'experiences', 'stack', 'projects', 'education'] as const;

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLang = () => i18n.changeLanguage(lang === 'fr' ? 'en' : 'fr');

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.nav
          className="navbar"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="navbar__inner">
            <span className="navbar__logo gradient-text">@{profile.firstName.toLowerCase()}</span>
            <ul className="navbar__links">
              {navKeys.map((key) => (
                <li key={key}>
                  <a href={'#' + key} className="navbar__link" onClick={(e) => handleAnchor(e, key)} data-hover="true">
                    {t('nav.' + key)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="navbar__controls">
              <button className="ctrl-btn" onClick={switchLang} data-hover="true" title="Changer de langue">
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button
                className="ctrl-btn"
                onClick={toggle}
                data-hover="true"
                title={t('theme.' + (theme === 'dark' ? 'switchToLight' : 'switchToDark'))}
              >
                <i className={'bi bi-' + (theme === 'dark' ? 'sun' : 'moon-stars')} />
              </button>
              <button className="btn btn--primary btn--sm" onClick={onContactClick} data-hover="true">
                {t('nav.contact')}
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
