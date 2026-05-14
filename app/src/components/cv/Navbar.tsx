import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getProfile } from '@/data/profile';

export function Navbar({ onContactClick }: { onContactClick: () => void }) {
  const { t, i18n } = useTranslation();
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
          role="navigation"
          aria-label={t('nav.ariaLabel') as string}
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="navbar__inner">
            <span className="navbar__logo gradient-text" aria-label={`@${profile.firstName.toLowerCase()} — accueil`}>
              @{profile.firstName.toLowerCase()}
            </span>
            <ul className="navbar__links">
              {navKeys.map((key) => (
                <li key={key}>
                  <a
                    href={'#' + key}
                    className="navbar__link"
                    onClick={(e) => handleAnchor(e, key)}
                    data-hover="true"
                    aria-label={t('nav.' + key) as string}
                  >
                    {t('nav.' + key)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="navbar__controls">
              <button
                className="ctrl-btn"
                onClick={switchLang}
                data-hover="true"
                aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                aria-pressed={lang === 'en' || undefined}
                type="button"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <ThemeToggle />
              <button
                className="btn btn--primary btn--sm"
                onClick={onContactClick}
                data-hover="true"
                type="button"
                aria-label={t('nav.contact') as string}
              >
                {t('nav.contact')}
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
