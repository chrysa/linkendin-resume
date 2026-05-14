import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { DEFAULT_PROFILE, PROFILES } from '@/data/profiles';

describe('ProfileContext', () => {
  beforeEach(() => {
    // Reset window.location.search between tests
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '' },
    });
  });

  it('returns DEFAULT_PROFILE when no ?profile param', () => {
    window.location.search = '';
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ProfileProvider, null, children);
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current).toEqual(DEFAULT_PROFILE);
  });

  it('returns DEFAULT_PROFILE for unknown profile slug', () => {
    window.location.search = '?profile=unknown-slug';
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ProfileProvider, null, children);
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current).toEqual(DEFAULT_PROFILE);
  });

  it('returns matching profile for valid slug', () => {
    const slugs = Object.keys(PROFILES);
    if (slugs.length === 0) return;
    const slug = slugs[0];
    window.location.search = `?profile=${slug}`;
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ProfileProvider, null, children);
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current).toEqual(PROFILES[slug]);
  });

  it('profile has a slug property', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ProfileProvider, null, children);
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current).toHaveProperty('slug');
  });
});
