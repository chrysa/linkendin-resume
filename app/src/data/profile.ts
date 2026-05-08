import cvData from '../../cv.json';
import type { LinkedInProfile } from '@/types/linkedin';
import type { MetricItem, Project, Skill } from '@/types';
import type { CvProfileFilter } from '@/types/profile';

// ─── Helper i18n ──────────────────────────────────────────────────────────
function pick<T>(fr: T, en: T | undefined, lang: string): T {
  return lang === 'en' && en !== undefined ? en : fr;
}

// ─── Builders qui lisent cv.json ──────────────────────────────────────────

export function getProfile(lang = 'fr', filter?: CvProfileFilter): LinkedInProfile {
  const b = cvData.basics;

  const experiences = filter?.experienceIndices?.length
    ? filter.experienceIndices.map((i) => cvData.experience[i]).filter(Boolean)
    : cvData.experience;

  return {
    id: 'local',
    firstName: b.firstName,
    lastName: b.lastName,
    headline: b.headline,
    summary: b.summary,
    photoUrl: b.photoUrl,
    location: b.location,
    profileUrl: b.linkedinUrl,
    positions: experiences.map((e) => ({
      title: pick(e.title, e.title_en, lang),
      company: e.company,
      location: e.location,
      startDate: { month: e.startMonth, year: e.startYear },
      endDate: e.endMonth && e.endYear ? { month: e.endMonth, year: e.endYear } : undefined,
      description: pick(e.description, e.description_en, lang),
      technologies: e.technologies,
    })),
    educations: cvData.education.map((ed) => ({
      school: ed.school,
      degree: pick(ed.degree, ed.degree_en, lang),
      fieldOfStudy: pick(ed.fieldOfStudy, ed.fieldOfStudy_en, lang),
      startYear: ed.startYear,
      endYear: ed.endYear,
    })),
    skills: cvData.skills.map((s) => s.name),
  };
}

export function getAvailability(lang = 'fr') {
  const a = cvData.basics.availability;
  return {
    available: a.available,
    label: lang === 'en' ? a.label_en : a.label,
    type: a.type,
  };
}

export function getMetrics(lang = 'fr'): MetricItem[] {
  return cvData.metrics.map((m) => ({
    value: m.value,
    label: pick(m.label, m.label_en, lang),
    sublabel: pick(m.sublabel, m.sublabel_en, lang),
  }));
}

export function getProjects(lang = 'fr', filter?: CvProfileFilter): Project[] {
  const projects = filter?.projectIndices?.length
    ? filter.projectIndices.map((i) => cvData.projects[i]).filter(Boolean)
    : cvData.projects;

  return projects.map((p) => ({
    title: pick(p.title, p.title_en, lang),
    description: pick(p.description, p.description_en, lang),
    url: p.url ?? undefined,
    githubUrl: p.githubUrl ?? undefined,
    technologies: p.technologies,
    impact: pick(p.impact, p.impact_en, lang) ?? undefined,
    stars: p.stars ?? undefined,
  }));
}

export function getSkills(filter?: CvProfileFilter): Skill[] {
  const skills = filter?.skillCategories?.length
    ? cvData.skills.filter((s) => filter.skillCategories!.includes(s.category as Skill['category']))
    : cvData.skills;

  return skills.map((s) => ({
    name: s.name,
    level: s.level as Skill['level'],
    category: s.category as Skill['category'],
  }));
}

/**
 * Retourne les rôles (titre @ entreprise) où cette technologie a été utilisée
 */
export function getExperiencesForTech(techName: string, lang = 'fr'): string[] {
  return cvData.experience
    .filter((e) => e.technologies.includes(techName))
    .map((e) => `${pick(e.title, e.title_en, lang)} @ ${e.company}`);
}

// ─── Constantes statiques ─────────────────────────────────────────────────

export const NAV_SECTION_IDS = ['impact', 'experiences', 'stack', 'projects', 'education'];

export const GITHUB_CONFIG = {
  owner: import.meta.env.VITE_GITHUB_OWNER ?? 'votre-username',
  repo: import.meta.env.VITE_GITHUB_REPO ?? 'contact',
  rateLimitMax: Number(import.meta.env.VITE_RATE_LIMIT_MAX ?? 3),
};

type CvContact = typeof cvData.basics extends { contact: infer C } ? C : never;
const _contact = (cvData.basics as { contact?: Partial<CvContact> }).contact;

export const CONTACT_CONFIG = {
  whatsapp: _contact?.whatsapp ?? '',
  whatsappPrefill: (lang: string) =>
    lang === 'en'
      ? (_contact?.whatsappPrefill_en ?? _contact?.whatsappPrefill ?? '')
      : (_contact?.whatsappPrefill ?? ''),
};
