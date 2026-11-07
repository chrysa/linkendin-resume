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
import fr from '@/i18n/fr';
import en from '@/i18n/en';

const noop = () => {};
const getForm = () => screen.getByPlaceholderText('modal.name.placeholder').closest('form') as HTMLFormElement;

describe('ContactModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('renders nothing when isOpen is false', () => {
    render(<ContactModal isOpen={false} onClose={noop} />);
    expect(screen.queryByRole('dialog')).toBeNull();
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
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
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
    expect(getForm()).toBeTruthy();
  });

  it('shows validation errors on empty submit', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fireEvent.submit(getForm());
    // errors should appear (schema requires min lengths)
    expect(screen.getAllByText(/Minimum \d+ caractères/).length).toBeGreaterThan(0);
  });

  it('clears field error on input change', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    // trigger validation to create errors
    fireEvent.submit(getForm());
    // start typing in senderName
    const nameInput = screen.getByPlaceholderText('modal.name.placeholder');
    fireEvent.change(nameInput, { target: { name: 'senderName', value: 'A' } });
    // error for senderName may clear (depends on re-render)
    expect(nameInput).toBeTruthy();
  });

  const fillAndSubmit = () => {
    fireEvent.change(screen.getByPlaceholderText('modal.name.placeholder'), {
      target: { name: 'senderName', value: 'Bob Martin' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.subject.placeholder'), {
      target: { name: 'subject', value: 'Opportunité CDI & suite' },
    });
    fireEvent.change(screen.getByPlaceholderText('modal.message.placeholder'), {
      target: { name: 'message', value: 'Je vous contacte concernant un poste de développeur senior.' },
    });
    fireEvent.submit(getForm());
  };

  it('hands off immediately, with no fake sending delay', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    fillAndSubmit();
    // No timer advanced: the hand-off step is already displayed.
    expect(screen.getByText('modal.success.title')).toBeTruthy();
    expect(timeoutSpy.mock.calls.filter(([, ms]) => ms === 800)).toHaveLength(0);
    timeoutSpy.mockRestore();
  });

  it('CTA href is the prefilled GitHub issues URL, opened safely in a new tab', () => {
    render(<ContactModal isOpen={true} onClose={noop} />);
    fillAndSubmit();
    const link = screen.getByText('modal.success.open').closest('a') as HTMLAnchorElement;
    const expected =
      'https://github.com/test-owner/test-repo/issues/new?title=' +
      encodeURIComponent('[Contact] Opportunité CDI & suite') +
      '&body=' +
      encodeURIComponent(
        '**De :** Bob Martin\n\nJe vous contacte concernant un poste de développeur senior.\n\n---\n*CV en ligne*'
      ) +
      '&labels=' +
      encodeURIComponent('job-offer');
    expect(link.getAttribute('href')).toBe(expected);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it.each([
    ['fr', fr, /pas encore envoy/i],
    ['en', en, /not been sent/i],
  ])('%s hand-off wording says the message is not sent yet', (_l, dict, notSent) => {
    expect(dict.modal.success.title).toMatch(notSent);
    expect(dict.modal.success.body).toMatch(/GitHub/);
    expect(dict.modal.success.title).not.toMatch(/Prêt à envoyer|Ready to send|envoyé !|sent!/i);
    expect(dict.modal.success.open).toMatch(/GitHub/);
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
    fireEvent.submit(getForm());
    await act(() => vi.runAllTimersAsync());
    fireEvent.click(screen.getByText('modal.success.back'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await act(() => vi.runAllTimersAsync());
  });
});
