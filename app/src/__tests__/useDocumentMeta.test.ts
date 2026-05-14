import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

function addMeta(name: string, property?: string) {
  const el = document.createElement('meta');
  if (property) el.setAttribute('property', property);
  else el.setAttribute('name', name);
  el.setAttribute('content', '');
  document.head.appendChild(el);
  return el;
}

describe('useDocumentMeta', () => {
  beforeEach(() => {
    document.title = '';
    document.querySelectorAll('meta[name],meta[property]').forEach((el) => el.remove());
    addMeta('description');
    addMeta('', 'og:title');
    addMeta('', 'og:description');
    addMeta('twitter:title');
    addMeta('twitter:description');
  });

  it('sets document.title in French by default', () => {
    renderHook(() => useDocumentMeta());
    expect(document.title).toContain('Développeur Full Stack');
  });

  it('sets document.title in English when lang=en', () => {
    renderHook(() => useDocumentMeta({ lang: 'en' }));
    expect(document.title).toContain('Full Stack Developer');
  });

  it('updates meta description', () => {
    renderHook(() => useDocumentMeta({ lang: 'fr' }));
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(desc.length).toBeGreaterThan(0);
  });

  it('sets html lang attribute', () => {
    renderHook(() => useDocumentMeta({ lang: 'en' }));
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('does not throw when meta elements are absent', () => {
    document.querySelectorAll('meta[name],meta[property]').forEach((el) => el.remove());
    expect(() => renderHook(() => useDocumentMeta({ lang: 'fr' }))).not.toThrow();
  });
});
