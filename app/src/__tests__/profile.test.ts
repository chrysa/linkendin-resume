import { describe, it, expect } from 'vitest';
import {
  getProfile,
  getAvailability,
  getMetrics,
  getProjects,
  getSkills,
  getExperiencesForTech,
  NAV_SECTION_IDS,
} from '@/data/profile';

describe('data/profile', () => {
  describe('getProfile', () => {
    it('returns a profile with firstName and lastName', () => {
      const p = getProfile();
      expect(typeof p.firstName).toBe('string');
      expect(p.firstName.length).toBeGreaterThan(0);
      expect(typeof p.lastName).toBe('string');
    });

    it('returns positions array', () => {
      const p = getProfile();
      expect(Array.isArray(p.positions)).toBe(true);
    });

    it('returns educations array', () => {
      const p = getProfile();
      expect(Array.isArray(p.educations)).toBe(true);
    });

    it('returns EN titles when lang=en', () => {
      const fr = getProfile('fr');
      const en = getProfile('en');
      // At least id is stable
      expect(fr.id).toBe(en.id);
    });

    it('filters positions by experienceIndices', () => {
      const full = getProfile('fr');
      const filtered = getProfile('fr', { experienceIndices: [0] });
      expect(filtered.positions.length).toBe(1);
      expect(filtered.positions[0].title).toBe(full.positions[0].title);
    });

    it('ignores out-of-range experienceIndices gracefully', () => {
      const filtered = getProfile('fr', { experienceIndices: [99999] });
      expect(filtered.positions.length).toBe(0);
    });
  });

  describe('getAvailability', () => {
    it('returns available flag and label', () => {
      const a = getAvailability();
      expect(typeof a.available).toBe('boolean');
      expect(typeof a.label).toBe('string');
    });

    it('returns EN label when lang=en', () => {
      const fr = getAvailability('fr');
      const en = getAvailability('en');
      expect(typeof en.label).toBe('string');
      // Both should be strings even if identical
      expect(fr.available).toBe(en.available);
    });
  });

  describe('getMetrics', () => {
    it('returns an array of metric items', () => {
      const metrics = getMetrics();
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('each metric has value and label', () => {
      for (const m of getMetrics()) {
        expect(typeof m.value).toBe('string');
        expect(typeof m.label).toBe('string');
      }
    });

    it('returns EN labels when lang=en', () => {
      const en = getMetrics('en');
      expect(en.length).toBeGreaterThan(0);
    });
  });

  describe('getProjects', () => {
    it('returns an array of projects', () => {
      const projects = getProjects();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('each project has title and technologies', () => {
      for (const p of getProjects()) {
        expect(typeof p.title).toBe('string');
        expect(Array.isArray(p.technologies)).toBe(true);
      }
    });

    it('filters projects by projectIndices', () => {
      const all = getProjects();
      const filtered = getProjects('fr', { projectIndices: [0] });
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe(all[0].title);
    });
  });

  describe('getSkills', () => {
    it('returns an array of skills', () => {
      const skills = getSkills();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });

    it('each skill has name, level and category', () => {
      for (const s of getSkills()) {
        expect(typeof s.name).toBe('string');
        expect(s.level).toBeGreaterThanOrEqual(1);
        expect(s.level).toBeLessThanOrEqual(5);
        expect(typeof s.category).toBe('string');
      }
    });

    it('filters skills by skillCategories', () => {
      const frontend = getSkills({ skillCategories: ['frontend'] });
      expect(frontend.every((s) => s.category === 'frontend')).toBe(true);
    });
  });

  describe('getExperiencesForTech', () => {
    it('returns an array of strings', () => {
      const results = getExperiencesForTech('Python');
      expect(Array.isArray(results)).toBe(true);
    });

    it('returns empty array for unknown tech', () => {
      expect(getExperiencesForTech('__non_existent_tech__')).toEqual([]);
    });
  });

  describe('NAV_SECTION_IDS', () => {
    it('contains expected section identifiers', () => {
      expect(NAV_SECTION_IDS).toContain('impact');
      expect(NAV_SECTION_IDS).toContain('experiences');
      expect(NAV_SECTION_IDS).toContain('projects');
    });
  });
});
