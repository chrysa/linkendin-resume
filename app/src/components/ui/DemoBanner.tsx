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
  // Semantic warning fill (amber, tracks the theme) with graphite ink on top.
  // --warning is #fbbf24 (dark) / #b45309 (light); graphite ink keeps >7:1 AA.
  color: 'var(--accent-ink)',
  background: 'var(--warning)',
  borderBottom: '1px solid color-mix(in srgb, var(--warning) 70%, #000)',
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
