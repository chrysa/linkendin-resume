import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCountUp } from '@/hooks/useCountUp';

// Keep inView=false so the animation effect does not run (avoids RAF infinite loop)
vi.mock('framer-motion', () => ({
  useInView: vi.fn(() => false),
}));

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns a ref and an initial display equal to the target', () => {
    const { result } = renderHook(() => useCountUp('42'));
    expect(result.current.ref).toBeDefined();
    // Before inView becomes true, display is initialised to target
    expect(result.current.display).toBe('42');
  });

  it('returns target as initial display for integer targets', () => {
    const { result } = renderHook(() => useCountUp('100'));
    expect(result.current.display).toBe('100');
  });

  it('returns target as initial display for prefixed/suffixed values', () => {
    const { result } = renderHook(() => useCountUp('+50k'));
    expect(result.current.display).toBe('+50k');
  });

  it('returns target unchanged when it cannot be parsed', () => {
    const { result } = renderHook(() => useCountUp('N/A'));
    expect(result.current.display).toBe('N/A');
  });

  it('returns target as initial display for float values', () => {
    const { result } = renderHook(() => useCountUp('3.5'));
    expect(result.current.display).toBe('3.5');
  });
});
