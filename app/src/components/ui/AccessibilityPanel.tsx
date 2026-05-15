import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface A11yPrefs {
  fontSize: number; // -2 to +4 (step of 1 = +2px)
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
}

const STORAGE_KEY = 'a11y-prefs';

const defaults: A11yPrefs = {
  fontSize: 0,
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
};

function loadPrefs(): A11yPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {
    /* ignore */
  }
  return defaults;
}

function applyPrefs(prefs: A11yPrefs) {
  const root = document.documentElement;

  // Font size offset (each step = +2px base)
  root.style.setProperty('--a11y-font-offset', `${prefs.fontSize * 2}px`);

  // High contrast
  root.dataset.highContrast = prefs.highContrast ? 'true' : '';

  // Dyslexia font
  root.dataset.dyslexia = prefs.dyslexiaFont ? 'true' : '';

  // Reduced motion
  root.dataset.reducedMotion = prefs.reducedMotion ? 'true' : '';
}

export function AccessibilityPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(loadPrefs);

  // Apply on mount + on change
  useEffect(() => {
    applyPrefs(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const update = (patch: Partial<A11yPrefs>) => setPrefs((p) => ({ ...p, ...patch }));

  const resetAll = () => setPrefs(defaults);

  return (
    <>
      {/* Trigger button */}
      <button
        className="a11y-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('a11y.panelLabel')}
        aria-expanded={open}
        aria-controls="a11y-panel"
        type="button"
        data-hover="true"
      >
        <i className="bi bi-universal-access" aria-hidden="true" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="a11y-panel"
            role="dialog"
            aria-label={t('a11y.panelLabel')}
            className="a11y-panel"
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="a11y-panel__header">
              <span className="a11y-panel__title">{t('a11y.panelLabel')}</span>
              <button
                className="a11y-panel__close"
                onClick={() => setOpen(false)}
                aria-label={t('a11y.close')}
                type="button"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            {/* Font size */}
            <div className="a11y-row">
              <span className="a11y-row__label">{t('a11y.fontSize')}</span>
              <div className="a11y-row__ctrl">
                <button
                  type="button"
                  className="a11y-step-btn"
                  onClick={() => update({ fontSize: Math.max(-2, prefs.fontSize - 1) })}
                  aria-label={t('a11y.decreaseFontSize')}
                  disabled={prefs.fontSize <= -2}
                >
                  A-
                </button>
                <span className="a11y-row__val" aria-live="polite">
                  {prefs.fontSize === 0 ? '100%' : `${100 + prefs.fontSize * 12}%`}
                </span>
                <button
                  type="button"
                  className="a11y-step-btn"
                  onClick={() => update({ fontSize: Math.min(4, prefs.fontSize + 1) })}
                  aria-label={t('a11y.increaseFontSize')}
                  disabled={prefs.fontSize >= 4}
                >
                  A+
                </button>
              </div>
            </div>

            {/* High contrast */}
            <label className="a11y-toggle">
              <input
                type="checkbox"
                checked={prefs.highContrast}
                onChange={(e) => update({ highContrast: e.target.checked })}
                aria-label={t('a11y.highContrast')}
              />
              <span className="a11y-toggle__track" aria-hidden="true" />
              <span className="a11y-toggle__label">{t('a11y.highContrast')}</span>
            </label>

            {/* Dyslexia font */}
            <label className="a11y-toggle">
              <input
                type="checkbox"
                checked={prefs.dyslexiaFont}
                onChange={(e) => update({ dyslexiaFont: e.target.checked })}
                aria-label={t('a11y.dyslexiaFont')}
              />
              <span className="a11y-toggle__track" aria-hidden="true" />
              <span className="a11y-toggle__label">{t('a11y.dyslexiaFont')}</span>
            </label>

            {/* Reduced motion */}
            <label className="a11y-toggle">
              <input
                type="checkbox"
                checked={prefs.reducedMotion}
                onChange={(e) => update({ reducedMotion: e.target.checked })}
                aria-label={t('a11y.reducedMotion')}
              />
              <span className="a11y-toggle__track" aria-hidden="true" />
              <span className="a11y-toggle__label">{t('a11y.reducedMotion')}</span>
            </label>

            <button type="button" className="a11y-reset" onClick={resetAll}>
              {t('a11y.reset')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
