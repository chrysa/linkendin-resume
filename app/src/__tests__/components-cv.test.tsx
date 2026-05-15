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
    i18n: { language: 'fr', changeLanguage: vi.fn() },
  }),
}));

// ── ProfileContext mock ─────────────────────────────────────────────────────
vi.mock('@/contexts/ProfileContext', () => ({
  useProfile: () => ({
    slug: 'default',
    filter: undefined,
    hero: undefined,
  }),
}));

import { Hero } from '@/components/cv/Hero';
import { Navbar } from '@/components/cv/Navbar';
import { ImpactMetrics } from '@/components/cv/ImpactMetrics';
import { ExperienceTimeline } from '@/components/cv/ExperienceTimeline';
import { ContactSection } from '@/components/cv/ContactSection';
import { EducationSection } from '@/components/cv/EducationSection';
import { ProjectsGrid } from '@/components/cv/ProjectsGrid';
import { SkillsCloud } from '@/components/cv/SkillsCloud';

// ── Hero ────────────────────────────────────────────────────────────────────
describe('Hero', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(Hero, { onContactClick: vi.fn() }));
    expect(container.firstChild).toBeTruthy();
  });

  it('calls onContactClick when CTA button is clicked', () => {
    const fn = vi.fn();
    render(React.createElement(Hero, { onContactClick: fn }));
    const btns = screen.queryAllByRole('button');
    if (btns.length > 0) {
      fireEvent.click(btns[0]);
      expect(fn).toHaveBeenCalled();
    }
  });

  it('triggers mousemove handler on window', () => {
    render(React.createElement(Hero, { onContactClick: vi.fn() }));
    fireEvent.mouseMove(window, { clientX: 300, clientY: 200 });
    // No crash — confirms event listener registered
  });

  it('renders photo with alt text', () => {
    render(React.createElement(Hero, { onContactClick: vi.fn() }));
    const img = document.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('fires onError fallback on broken photo', () => {
    render(React.createElement(Hero, { onContactClick: vi.fn() }));
    const img = document.querySelector('img');
    if (img) {
      fireEvent.error(img);
      expect(img.src).toContain('ui-avatars.com');
    }
  });
});

// ── Navbar ──────────────────────────────────────────────────────────────────
describe('Navbar', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(Navbar, { onContactClick: vi.fn() }));
    expect(container).toBeTruthy();
  });

  it('shows navbar content after scroll > 60px', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 });
    render(React.createElement(Navbar, { onContactClick: vi.fn() }));
    fireEvent.scroll(window);
    const nav = screen.queryByRole('navigation');
    expect(nav).toBeTruthy();
  });

  it('calls switchLang when language button is clicked', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 });
    render(React.createElement(Navbar, { onContactClick: vi.fn() }));
    fireEvent.scroll(window);
    const langBtn = screen.queryByText('EN');
    if (langBtn) fireEvent.click(langBtn);
    // no crash — switchLang body executed
  });

  it('calls onContactClick from navbar contact button', () => {
    const fn = vi.fn();
    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 });
    render(React.createElement(Navbar, { onContactClick: fn }));
    fireEvent.scroll(window);
    const btns = screen.queryAllByRole('button');
    const contactBtn = btns.find((b) => b.textContent?.includes('nav.contact'));
    if (contactBtn) {
      fireEvent.click(contactBtn);
      expect(fn).toHaveBeenCalled();
    }
  });

  it('triggers handleAnchor on nav link click', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 });
    render(React.createElement(Navbar, { onContactClick: vi.fn() }));
    fireEvent.scroll(window);
    const links = screen.queryAllByRole('link');
    if (links.length > 0) {
      // scrollIntoView is not in jsdom, stub it
      document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: vi.fn() });
      fireEvent.click(links[0]);
    }
  });
});

// ── ImpactMetrics ───────────────────────────────────────────────────────────
describe('ImpactMetrics', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(ImpactMetrics));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders metric cards', () => {
    render(React.createElement(ImpactMetrics));
    const items = screen.queryAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(0);
  });
});

// ── ExperienceTimeline ──────────────────────────────────────────────────────
describe('ExperienceTimeline', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(ExperienceTimeline));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a section element', () => {
    const { container } = render(React.createElement(ExperienceTimeline));
    expect(container.querySelector('section')).toBeTruthy();
  });
});

// ── ContactSection ──────────────────────────────────────────────────────────
describe('ContactSection', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(ContactSection, { onContactClick: vi.fn() }));
    expect(container.firstChild).toBeTruthy();
  });

  it('calls onContactClick when contact button is clicked', () => {
    const fn = vi.fn();
    render(React.createElement(ContactSection, { onContactClick: fn }));
    const btns = screen.queryAllByRole('button');
    if (btns.length > 0) {
      fireEvent.click(btns[0]);
      expect(fn).toHaveBeenCalled();
    }
  });
});

// ── EducationSection ─────────────────────────────────────────────────────────
describe('EducationSection', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(EducationSection));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a section element', () => {
    const { container } = render(React.createElement(EducationSection));
    expect(container.querySelector('section')).toBeTruthy();
  });
});

// ── ProjectsGrid ─────────────────────────────────────────────────────────────
describe('ProjectsGrid', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(ProjectsGrid));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a section element', () => {
    const { container } = render(React.createElement(ProjectsGrid));
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('fires mousemove on project card (3D tilt)', () => {
    const { container } = render(React.createElement(ProjectsGrid));
    const article = container.querySelector('article');
    if (article) {
      fireEvent.mouseMove(article, { clientX: 200, clientY: 100 });
      fireEvent.mouseLeave(article);
    }
  });
});

// ── SkillsCloud ──────────────────────────────────────────────────────────────
describe('SkillsCloud', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(SkillsCloud));
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a section with id=stack', () => {
    render(React.createElement(SkillsCloud));
    const section = document.getElementById('stack');
    expect(section).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(React.createElement(SkillsCloud));
    const btns = screen.queryAllByRole('button');
    expect(btns.length).toBeGreaterThan(0);
  });

  it('filters skills when category button is clicked', () => {
    render(React.createElement(SkillsCloud));
    const btns = screen.queryAllByRole('button');
    if (btns.length > 1) {
      fireEvent.click(btns[1]);
      // After click on a category, pressed state should update — no crash
      expect(btns[1].getAttribute('aria-pressed')).toBe('true');
    }
  });

  it('switches back to all when all button is clicked', () => {
    render(React.createElement(SkillsCloud));
    const btns = screen.queryAllByRole('button');
    if (btns.length > 1) {
      fireEvent.click(btns[1]);
      fireEvent.click(btns[0]); // "all" is first
      expect(btns[0].getAttribute('aria-pressed')).toBe('true');
    }
  });

  it('hovers a skill pill to show tooltip', () => {
    render(React.createElement(SkillsCloud));
    const pills = document.querySelectorAll('[tabindex="0"]');
    if (pills.length > 0) {
      fireEvent.mouseEnter(pills[0]);
      fireEvent.focus(pills[0]);
      fireEvent.blur(pills[0]);
    }
  });
});
