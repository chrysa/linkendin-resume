import type { CvProfile } from '@/types/profile';

/**
 * Profils disponibles — identifiés par le param URL ?profile=<slug>
 *
 * Chaque profil est une "vue" sur le même cv.json : il filtre et réordonne
 * les expériences, compétences et projets sans dupliquer les données.
 *
 * Ajouter un profil :
 *   1. Ajouter une entrée ici avec le slug souhaité
 *   2. L'URL ?profile=<slug> montrera ce profil automatiquement
 */
export const PROFILES: Record<string, CvProfile> = {
  default: {
    slug: 'default',
    label: 'CV Complet',
    label_en: 'Full CV',
  },

  freelance: {
    slug: 'freelance',
    label: 'Freelance',
    label_en: 'Freelance',
    hero: {
      tagline: 'Freelance disponible — React · TypeScript · Node.js',
      tagline_en: 'Freelance available — React · TypeScript · Node.js',
    },
    filter: {
      skillCategories: ['frontend', 'backend', 'tools'],
    },
  },

  backend: {
    slug: 'backend',
    label: 'Développeur Backend',
    label_en: 'Backend Developer',
    hero: {
      tagline: 'Architecte backend — APIs robustes · microservices · performance',
      tagline_en: 'Backend architect — robust APIs · microservices · performance',
    },
    filter: {
      skillCategories: ['backend', 'devops'],
    },
  },

  fullstack: {
    slug: 'fullstack',
    label: 'Full Stack',
    label_en: 'Full Stack',
    hero: {
      tagline: 'Full Stack — de l\'API au pixel, bout en bout',
      tagline_en: 'Full Stack — from API to pixel, end to end',
    },
    filter: {
      skillCategories: ['frontend', 'backend', 'devops', 'tools'],
    },
  },
};

export const DEFAULT_PROFILE: CvProfile = PROFILES.default;
