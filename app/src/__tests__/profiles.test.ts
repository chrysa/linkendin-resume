import { describe, it, expect } from 'vitest';
import { PROFILES, DEFAULT_PROFILE } from '@/data/profiles';

describe('profiles', () => {
  it('exports PROFILES with at least a default entry', () => {
    expect(PROFILES).toBeDefined();
    expect(PROFILES['default']).toBeDefined();
  });

  it('exports DEFAULT_PROFILE with a slug', () => {
    expect(DEFAULT_PROFILE).toBeDefined();
    expect(DEFAULT_PROFILE.slug).toBe('default');
  });

  it('every profile entry has a slug and a label', () => {
    for (const [slug, profile] of Object.entries(PROFILES)) {
      expect(profile.slug).toBe(slug);
      expect(typeof profile.label).toBe('string');
    }
  });
});
