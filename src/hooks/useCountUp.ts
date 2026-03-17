import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

function parse(raw: string): { prefix: string; num: number; suffix: string } | null {
  const m = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] };
}

export function useCountUp(target: string, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const parsed = parse(target);
  const [display, setDisplay] = useState(
    parsed ? `${parsed.prefix}0${parsed.suffix}` : target,
  );

  useEffect(() => {
    if (!inView || !parsed) { setDisplay(target); return; }
    const { prefix, num, suffix } = parsed;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = Number.isInteger(num)
        ? String(Math.round(eased * num))
        : (eased * num).toFixed(1);
      setDisplay(`${prefix}${cur}${suffix}`);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, display };
}
