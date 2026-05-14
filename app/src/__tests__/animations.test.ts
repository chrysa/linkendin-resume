import { describe, it, expect } from 'vitest';
import { fadeUp, stagger, scaleIn, slideLeft, slideRight } from '@/utils/animations';

describe('animations', () => {
  it('fadeUp has hidden and show states', () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 28 });
    expect(fadeUp.show).toMatchObject({ opacity: 1, y: 0 });
  });

  it('stagger hidden state is empty object', () => {
    expect(stagger.hidden).toEqual({});
    expect((stagger.show as { transition: { staggerChildren: number } }).transition.staggerChildren).toBe(0.09);
  });

  it('scaleIn starts from scale 0.85', () => {
    expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.85 });
    expect(scaleIn.show).toMatchObject({ opacity: 1, scale: 1 });
  });

  it('slideLeft starts from x: -32', () => {
    expect(slideLeft.hidden).toEqual({ opacity: 0, x: -32 });
    expect(slideLeft.show).toMatchObject({ opacity: 1, x: 0 });
  });

  it('slideRight starts from x: 32', () => {
    expect(slideRight.hidden).toEqual({ opacity: 0, x: 32 });
    expect(slideRight.show).toMatchObject({ opacity: 1, x: 0 });
  });
});
