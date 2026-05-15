import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Framer-motion mock ──────────────────────────────────────────────────────
const makeElement = (tag: string) => {
  const C = ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
    React.createElement(tag, props, children);
  C.displayName = `Motion.${tag}`;
  return C;
};

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_t, tag: string) => makeElement(tag) }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  useSpring: (v: unknown) => v,
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_v: unknown, _from: unknown, to: unknown[]) => to[0],
}));

// ── i18n mock ───────────────────────────────────────────────────────────────
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr' },
  }),
}));

// ── ProfileContext mock ─────────────────────────────────────────────────────
vi.mock('@/contexts/ProfileContext', () => ({
  useProfile: () => ({ slug: 'default', filter: undefined, hero: undefined }),
  ProfileProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// ── ContactModal mock ────────────────────────────────────────────────────────
vi.mock('@/components/contact/ContactModal', () => ({
  ContactModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? React.createElement('div', { 'data-testid': 'contact-modal' }) : null,
}));

// ── useDocumentMeta mock ─────────────────────────────────────────────────────
vi.mock('@/hooks/useDocumentMeta', () => ({
  useDocumentMeta: vi.fn(),
}));

// ── Individual CV component mocks ────────────────────────────────────────────
vi.mock('@/components/cv/Navbar', () => ({
  Navbar: ({ onContactClick }: { onContactClick: () => void }) =>
    React.createElement(
      'nav',
      { 'data-testid': 'navbar' },
      React.createElement('button', { onClick: onContactClick }, 'Contact')
    ),
}));
vi.mock('@/components/cv/Hero', () => ({
  Hero: () => React.createElement('section', { 'data-testid': 'hero' }),
}));
vi.mock('@/components/cv/ImpactMetrics', () => ({
  ImpactMetrics: () => React.createElement('section', { 'data-testid': 'impact-metrics' }),
}));
vi.mock('@/components/cv/ExperienceTimeline', () => ({
  ExperienceTimeline: () => React.createElement('section', { 'data-testid': 'experience-timeline' }),
}));
vi.mock('@/components/cv/SkillsCloud', () => ({
  SkillsCloud: () => React.createElement('section', { 'data-testid': 'skills-cloud' }),
}));
vi.mock('@/components/cv/ProjectsGrid', () => ({
  ProjectsGrid: () => React.createElement('section', { 'data-testid': 'projects-grid' }),
}));
vi.mock('@/components/cv/EducationSection', () => ({
  EducationSection: () => React.createElement('section', { 'data-testid': 'education-section' }),
}));
vi.mock('@/components/cv/ContactSection', () => ({
  ContactSection: ({ onContactClick }: { onContactClick: () => void }) =>
    React.createElement(
      'section',
      { 'data-testid': 'contact-section' },
      React.createElement('button', { onClick: onContactClick }, 'Open Contact')
    ),
}));
vi.mock('@/components/ui/ScrollProgress', () => ({
  ScrollProgress: () => React.createElement('div', { 'data-testid': 'scroll-progress' }),
}));
vi.mock('@/components/ui/CustomCursor', () => ({
  CustomCursor: () => React.createElement('div', { 'data-testid': 'custom-cursor' }),
}));
vi.mock('@/components/ui/FloatingCTA', () => ({
  FloatingCTA: ({ onContactClick }: { onContactClick: () => void }) =>
    React.createElement('button', { 'data-testid': 'floating-cta', onClick: onContactClick }, 'CTA'),
}));

import { CVPage } from '@/pages/CVPage';

describe('CVPage', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(CVPage));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders all major sections', () => {
    render(React.createElement(CVPage));
    expect(screen.getByTestId('hero')).toBeTruthy();
    expect(screen.getByTestId('impact-metrics')).toBeTruthy();
    expect(screen.getByTestId('experience-timeline')).toBeTruthy();
    expect(screen.getByTestId('skills-cloud')).toBeTruthy();
    expect(screen.getByTestId('projects-grid')).toBeTruthy();
    expect(screen.getByTestId('education-section')).toBeTruthy();
    expect(screen.getByTestId('contact-section')).toBeTruthy();
  });

  it('renders scroll progress and floating CTA', () => {
    render(React.createElement(CVPage));
    expect(screen.getByTestId('scroll-progress')).toBeTruthy();
    expect(screen.getByTestId('floating-cta')).toBeTruthy();
  });

  it('opens contact modal when Navbar contact button is clicked', () => {
    render(React.createElement(CVPage));
    const btn = screen.getByText('Contact');
    fireEvent.click(btn);
    expect(screen.getByTestId('contact-modal')).toBeTruthy();
  });

  it('opens contact modal from ContactSection button', () => {
    render(React.createElement(CVPage));
    const btn = screen.getByText('Open Contact');
    fireEvent.click(btn);
    expect(screen.getByTestId('contact-modal')).toBeTruthy();
  });

  it('opens contact modal from FloatingCTA', () => {
    render(React.createElement(CVPage));
    const btn = screen.getByTestId('floating-cta');
    fireEvent.click(btn);
    expect(screen.getByTestId('contact-modal')).toBeTruthy();
  });

  it('renders footer with current year', () => {
    render(React.createElement(CVPage));
    const footer = document.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain(String(new Date().getFullYear()));
  });
});
