import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMetrics } from '@/data/profile';
import { useCountUp } from '@/hooks/useCountUp';
import { stagger, scaleIn } from '@/utils/animations';

function MetricCard({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <motion.div className="metric-card" variants={scaleIn} whileHover={{ y: -6, scale: 1.03 }}>
      <span ref={ref} className="metric-card__value gradient-text">{display}</span>
      <span className="metric-card__label">{label}</span>
      {sublabel && <span className="metric-card__sub">{sublabel}</span>}
    </motion.div>
  );
}

export function ImpactMetrics() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const metrics = getMetrics(lang);

  return (
    <section id="impact" className="section section--dark" ref={ref}>
      <div className="container">
        <motion.p className="section__label" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.impact.label')}
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {t('sections.impact.title')}
        </motion.h2>
        <motion.div className="metrics" variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {metrics.map((m) => (
            <MetricCard key={m.label} value={m.value} label={m.label} sublabel={m.sublabel} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
