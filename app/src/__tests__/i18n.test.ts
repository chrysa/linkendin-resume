import { describe, it, expect } from 'vitest';
import en from '@/i18n/en';
import fr from '@/i18n/fr';
// Import setup to cover the i18n initialization side-effect
import '@/i18n/setup';

describe('i18n translations', () => {
  it('en has all required nav keys', () => {
    expect(typeof en.nav.impact).toBe('string');
    expect(typeof en.nav.experiences).toBe('string');
    expect(typeof en.nav.stack).toBe('string');
    expect(typeof en.nav.projects).toBe('string');
    expect(typeof en.nav.education).toBe('string');
    expect(typeof en.nav.contact).toBe('string');
  });

  it('fr has all required nav keys', () => {
    expect(typeof fr.nav.impact).toBe('string');
    expect(typeof fr.nav.experiences).toBe('string');
    expect(typeof fr.nav.contact).toBe('string');
  });

  it('en and fr have the same top-level keys', () => {
    const enKeys = Object.keys(en).sort();
    const frKeys = Object.keys(fr).sort();
    expect(enKeys).toEqual(frKeys);
  });

  it('en hero greeting is non-empty', () => {
    expect(en.hero.greeting.length).toBeGreaterThan(0);
  });

  it('fr hero greeting is non-empty', () => {
    expect(fr.hero.greeting.length).toBeGreaterThan(0);
  });

  it('en sections.skills.filters.all is defined', () => {
    expect(typeof en.sections.skills.filters.all).toBe('string');
  });

  it('fr sections.impact.title is defined', () => {
    expect(typeof fr.sections.impact.title).toBe('string');
  });
});
