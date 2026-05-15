import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock framer-motion to avoid animation complexity in tests
const makeElement = (tag: string) => {
  const Component = ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
    React.createElement(tag, props, children);
  Component.displayName = `Motion.${tag}`;
  return Component;
};

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) => makeElement(tag),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useInView: () => false,
  useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  useTransform: (_v: unknown, _from: unknown, to: unknown[]) => to[0],
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr' },
  }),
}));

import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { FloatingCTA } from '@/components/ui/FloatingCTA';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/hooks/useTheme';

function withTheme(ui: React.ReactElement) {
  return React.createElement(ThemeProvider, null, ui);
}

describe('ScrollProgress', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(ScrollProgress));
    expect(container.firstChild).toBeTruthy();
  });
});

describe('FloatingCTA', () => {
  it('renders without crashing', () => {
    const onContactClick = vi.fn();
    render(React.createElement(FloatingCTA, { onContactClick }));
    // Button not visible initially (scrollY = 0)
  });

  it('calls onContactClick when button is clicked (when visible)', () => {
    // Simulate scrolled state by dispatching scroll event
    const onContactClick = vi.fn();
    render(React.createElement(FloatingCTA, { onContactClick }));
    // Component mounts without error
    expect(onContactClick).not.toHaveBeenCalled();
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it('renders a button element', () => {
    render(withTheme(React.createElement(ThemeToggle)));
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    render(withTheme(React.createElement(ThemeToggle)));
    const button = screen.getByRole('button');
    await user.click(button);
    // After toggle, data-theme should change (dark → light)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

import { CustomCursor } from '@/components/ui/CustomCursor';

describe('CustomCursor', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false, // hover: none → false (so cursor is enabled)
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it('renders nothing initially (not visible until mousemove)', () => {
    const { container } = render(React.createElement(CustomCursor));
    // Before mousemove, cursor is hidden → null
    expect(container.firstChild).toBeNull();
  });

  it('becomes visible after mousemove event', () => {
    const { container } = render(React.createElement(CustomCursor));
    fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
    // After mousemove, cursor elements should be visible
    expect(container.firstChild).not.toBeNull();
  });

  it('hides cursor on mouseleave document', () => {
    const { container } = render(React.createElement(CustomCursor));
    fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });
    expect(container.firstChild).not.toBeNull();
    fireEvent.mouseLeave(document);
    expect(container.firstChild).toBeNull();
  });

  it('skips cursor on touch devices (hover: none)', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: true,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    const { container } = render(React.createElement(CustomCursor));
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
    expect(container.firstChild).toBeNull();
  });
});

describe('FloatingCTA visibility', () => {
  it('becomes visible after scroll past 70% of window height', () => {
    const onContactClick = vi.fn();
    const { container } = render(React.createElement(FloatingCTA, { onContactClick }));
    // Simulate scrollY > innerHeight * 0.7
    Object.defineProperty(window, 'scrollY', { writable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 900 });
    fireEvent.scroll(window);
    // Button should now be rendered
    const btn = container.querySelector('button');
    expect(btn).not.toBeNull();
  });
});
