import type { CSSProperties } from 'react';
import { isDemoMode } from '@/utils/demoMode';

const bannerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.4rem 1.25rem',
  fontSize: '0.85rem',
  fontWeight: 500,
  // Amber on near-black — contrast ratio > 7:1 (WCAG 2.1 AA, even AAA).
  color: '#451a03',
  background: '#fbbf24',
  borderBottom: '1px solid #b45309',
  textAlign: 'center',
};

const labelStyle: CSSProperties = {
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

/**
 * Persistent amber strip shown at the very top of the page while demo mode is
 * active (VITE_DEMO_MODE=true). It signals that every data source is serving
 * fixture data and no real credentials are in use. Hidden entirely otherwise.
 */
export function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div role="status" aria-live="polite" data-testid="demo-banner" style={bannerStyle}>
      <span style={labelStyle}>Demo</span>
      <span aria-hidden="true">—</span>
      <span>You are exploring sample data. No real credentials are used.</span>
    </div>
  );
}
