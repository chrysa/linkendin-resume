import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getSkills, getExperiencesForTech } from '@/data/profile';
import { useProfile } from '@/contexts/ProfileContext';
import type { Skill } from '@/types';
import { stagger, scaleIn } from '@/utils/animations';

const CATEGORY_KEYS: Skill['category'][] = ['frontend', 'backend', 'devops', 'tools'];

function SkillPill({ skill, lang }: { skill: Skill; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();
  const levels = t('sections.skills.levels', { returnObjects: true }) as string[];
  const experiences = getExperiencesForTech(skill.name, lang);

  return (
    <motion.li
      className={'skill-pill skill-pill--l' + skill.level}
      variants={scaleIn}
      whileHover={{ scale: 1.1, y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative' }}
      tabIndex={0}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${skill.name} — ${(t('sections.skills.levels', { returnObjects: true }) as string[])[skill.level]}`}
    >
      <span className="skill-pill__name">{skill.name}</span>
      <div className="skill-pill__dots">
        {[1, 2, 3, 4, 5].map((d) => (
          <span key={d} className={'skill-pill__dot' + (d <= skill.level ? ' skill-pill__dot--active' : '')} />
        ))}
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="skill-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <div className="skill-tooltip__level">{levels[skill.level]}</div>
            {experiences.length > 0 && (
              <ul className="skill-tooltip__list">
                {experiences.map((exp) => (
                  <li key={exp}>{exp}</li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function SkillsCloud() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const activeProfile = useProfile();
  const skills = getSkills(activeProfile.filter);
  const [activeCategory, setActiveCategory] = useState<Skill['category'] | 'all'>('all');

  const categories: Array<'all' | Skill['category']> = ['all', ...CATEGORY_KEYS];
  const filtered = activeCategory === 'all' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="stack" className="section section--dark" ref={ref}>
      <div className="container">
        <motion.p className="section__label" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          {t('sections.skills.label')}
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {t('sections.skills.title')}
        </motion.h2>
        <div className="skills__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={'filter-btn' + (activeCategory === cat ? ' filter-btn--active' : '')}
              onClick={() => setActiveCategory(cat)}
              data-hover="true"
              aria-pressed={activeCategory === cat ? 'true' : 'false'}
              type="button"
            >
              {cat === 'all' ? t('sections.skills.filters.all') : t('sections.skills.filters.' + cat)}
            </button>
          ))}
        </div>
        <motion.ul
          className="skills__cloud"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          aria-label={t('sections.skills.ariaCloud') as string}
        >
          {filtered.map((skill) => (
            <SkillPill key={skill.name} skill={skill} lang={lang} />
          ))}
        </motion.ul>
        <p className="skills__hint">{t('sections.skills.hint')}</p>
      </div>
    </section>
  );
}
