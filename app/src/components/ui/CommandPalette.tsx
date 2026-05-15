import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PaletteAction {
  id: string;
  label: string;
  icon: string;
  group: string;
  action: () => void;
  keywords?: string;
}

interface CommandPaletteProps {
  onContactClick: () => void;
}

export function CommandPalette({ onContactClick }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();

  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';

  const actions: PaletteAction[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-impact',
        label: t('nav.impact'),
        icon: 'bi-bar-chart-line',
        group: t('palette.groupNav'),
        action: () => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: 'metrics chiffres impact',
      },
      {
        id: 'nav-experiences',
        label: t('nav.experiences'),
        icon: 'bi-briefcase',
        group: t('palette.groupNav'),
        action: () => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: 'work job career parcours',
      },
      {
        id: 'nav-stack',
        label: t('nav.stack'),
        icon: 'bi-cpu',
        group: t('palette.groupNav'),
        action: () => document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: 'skills competences tech',
      },
      {
        id: 'nav-projects',
        label: t('nav.projects'),
        icon: 'bi-grid',
        group: t('palette.groupNav'),
        action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: 'projets portfolio github',
      },
      {
        id: 'nav-education',
        label: t('nav.education'),
        icon: 'bi-mortarboard',
        group: t('palette.groupNav'),
        action: () => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' }),
        keywords: 'formation ecole school',
      },
      // Actions
      {
        id: 'contact',
        label: t('nav.contact'),
        icon: 'bi-chat-dots',
        group: t('palette.groupActions'),
        action: onContactClick,
        keywords: 'message email github issue',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: 'bi-linkedin',
        group: t('palette.groupActions'),
        action: () => window.open('https://www.linkedin.com/in/anthonygreau', '_blank', 'noopener'),
        keywords: 'profil profile linkedin',
      },
      {
        id: 'github',
        label: 'GitHub',
        icon: 'bi-github',
        group: t('palette.groupActions'),
        action: () => window.open('https://github.com/chrysa', '_blank', 'noopener'),
        keywords: 'github repos code',
      },
      {
        id: 'print',
        label: t('palette.print'),
        icon: 'bi-printer',
        group: t('palette.groupActions'),
        action: () => window.print(),
        keywords: 'pdf print télécharger download',
      },
      // Appearance
      {
        id: 'lang-fr',
        label: 'Passer en français',
        icon: 'bi-translate',
        group: t('palette.groupAppearance'),
        action: () => i18n.changeLanguage('fr'),
        keywords: 'langue french fr',
      },
      {
        id: 'lang-en',
        label: 'Switch to English',
        icon: 'bi-translate',
        group: t('palette.groupAppearance'),
        action: () => i18n.changeLanguage('en'),
        keywords: 'language english en',
      },
      {
        id: 'theme-dark',
        label: t('theme.switchToDark'),
        icon: 'bi-moon-stars',
        group: t('palette.groupAppearance'),
        action: () => (document.documentElement.dataset.theme = 'dark'),
        keywords: 'dark mode sombre nuit',
      },
      {
        id: 'theme-light',
        label: t('theme.switchToLight'),
        icon: 'bi-sun',
        group: t('palette.groupAppearance'),
        action: () => (document.documentElement.dataset.theme = 'light'),
        keywords: 'light mode clair jour',
      },
    ],
    [t, i18n, lang, onContactClick] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        (a.keywords?.toLowerCase().includes(q) ?? false)
    );
  }, [query, actions]);

  // Group filtered actions
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteAction[]>();
    for (const a of filtered) {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    }
    return map;
  }, [filtered]);

  // Flat list for keyboard navigation
  const flatFiltered = filtered;

  // Reset selection on filter change
  useEffect(() => setSelectedIndex(0), [query]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const action = flatFiltered[selectedIndex];
      if (action) {
        action.action();
        setOpen(false);
      }
    }
  };

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="palette"
            role="dialog"
            aria-label={t('palette.label')}
            aria-modal="true"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onKeyDown={handleKeyDown}
          >
            <div className="palette__search">
              <i className="bi bi-search palette__search-icon" aria-hidden="true" />
              <input
                ref={inputRef}
                className="palette__input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('palette.placeholder')}
                aria-label={t('palette.placeholder')}
                spellCheck={false}
                autoComplete="off"
                role="combobox"
                aria-expanded={true}
                aria-autocomplete="list"
              />
              <kbd className="palette__esc">Esc</kbd>
            </div>

            <div className="palette__list" role="listbox" aria-label={t('palette.label')}>
              {grouped.size === 0 ? (
                <div className="palette__empty">{t('palette.noResults')}</div>
              ) : (
                Array.from(grouped.entries()).map(([group, items]) => (
                  <div key={group} className="palette__group">
                    <div className="palette__group-label">{group}</div>
                    {items.map((action) => {
                      const idx = flatIdx++;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={action.id}
                          className={`palette__item${isSelected ? ' palette__item--selected' : ''}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            action.action();
                            setOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          type="button"
                        >
                          <i className={`bi ${action.icon} palette__item-icon`} aria-hidden="true" />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="palette__footer">
              <span>
                <kbd>↑↓</kbd> {t('palette.navigate')}
              </span>
              <span>
                <kbd>↵</kbd> {t('palette.select')}
              </span>
              <span>
                <kbd>Esc</kbd> {t('palette.close')}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
