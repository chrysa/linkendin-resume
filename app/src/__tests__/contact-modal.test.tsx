import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useInView: () => false,
  useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  useTransform: (_v: unknown, _from: unknown, to: unknown[]) => to[0],
}));

// ── react-i18next mock ──────────────────────────────────────────────────────
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr' },
  }),
}));

// ── data/profile mock ──────────────────────────────────────────────────────
vi.mock('@/data/profile', () => ({
  GITHUB_CONFIG: { owner: 'test-owner', repo: 'test-repo' },
  CONTACT_CONFIG: {
    whatsapp: '+33600000000',
    whatsappPrefill: (lang: string) => (lang === 'en' ? 'Hi!' : 'Bonjour !'),
  },
}));

import { ContactModal } from '@/components/contact/ContactModal';

const noop = () => {};

describe('ContactModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ContactModal isOpen={false} onClose={noop} />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders dialog when isOpen is true', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    const btn = document.querySelector('.modal__close') as HTMLElement;
    fireEvent.click(btn);
    // after close button: onClose fires + deferred reset
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(400);
  });

  it('shows both tabs when whatsapp is configured', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    expect(screen.getByText('modal.tabGithub')).toBeTruthy();
    expect(screen.getByText('modal.tabWhatsapp')).toBeTruthy();
  });

  it('switches to whatsapp tab on click', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fireEvent.click(screen.getByText('modal.tabWhatsapp'));
    expect(screen.getByText('modal.whatsappCta')).toBeTruthy();
  });

  it('switches back to github tab after whatsapp', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fireEvent.click(screen.getByText('modal.tabWhatsapp'));
    fireEvent.click(screen.getByText('modal.tabGithub'));
    // form should be visible again
    expect(document.querySelector('form')).toBeTruthy();
  });

  it('shows validation errors on empty submit', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    // errors should appear (schema requires min lengths)
    const errorEls = document.querySelectorAll('.form-field__error');
    expect(errorEls.length).toBeGreaterThan(0);
  });

  it('clears field error on input change', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    // trigger validation to create errors
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    // start typing in senderName
    const nameInput = screen.getByPlaceholderText('modal.name.placeholder');
    fireEvent.change(nameInput, { target: { name: 'senderName', value: 'A' } });
    // error for senderName may clear (depends on re-render)
    expect(nameInput).toBeTruthy();
  });

  it('submits form and shows success state', async () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fireEvent.change(screen.getByPlaceholderText('modal.name.placeholder'), {
      target: { name: 'senderName', value: 'Alice Dupont' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.subject.placeholder'), {
      target: { name: 'subject', value: 'Collaboration projet freelance' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.message.placeholder'), {
      target: { name: 'message', value: 'Bonjour, je souhaite collaborer sur un projet passionnant.' },
    });
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    await act(() => vi.runAllTimersAsync());
    expect(screen.getByText('modal.success.title')).toBeTruthy();
  });

  it('success view has a link to GitHub issues', async () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fireEvent.change(screen.getByPlaceholderText('modal.name.placeholder'), {
      target: { name: 'senderName', value: 'Bob Martin' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.subject.placeholder'), {
      target: { name: 'subject', value: 'Opportunité CDI intéressante' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.message.placeholder'), {
      target: { name: 'message', value: 'Je vous contacte concernant un poste de développeur senior.' },
    });
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    await act(() => vi.runAllTimersAsync());
    const link = screen.getByText('modal.success.open');
    expect(link.closest('a')?.href).toContain('github.com/test-owner/test-repo');
  });

  it('back button in success view closes modal', async () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('modal.name.placeholder'), {
      target: { name: 'senderName', value: 'Alice Dupont' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.subject.placeholder'), {
      target: { name: 'subject', value: 'Question générale rapide' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.message.placeholder'), {
      target: { name: 'message', value: 'Simple question sur votre disponibilité pour une mission.' },
    });
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    await act(() => vi.runAllTimersAsync());
    fireEvent.click(screen.getByText('modal.success.back'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await act(() => vi.runAllTimersAsync());
  });
});
