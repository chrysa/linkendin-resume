export interface CvProfileFilter {
  /** Indices dans cv.json.experience à inclure (undefined = tous) */
  experienceIndices?: number[];
  /** Catégories de compétences à inclure (undefined = toutes) */
  skillCategories?: Array<'frontend' | 'backend' | 'devops' | 'tools' | 'soft'>;
  /** Indices dans cv.json.projects à inclure (undefined = tous) */
  projectIndices?: number[];
}

export interface CvProfile {
  slug: string;
  label: string;
  label_en?: string;
  /** Overrides optionnels pour la section Hero */
  hero?: {
    tagline?: string;
    tagline_en?: string;
  };
  filter?: CvProfileFilter;
}
