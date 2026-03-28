import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const ringX = useSpring(mx, { stiffness: 160, damping: 24 });
  const ringY = useSpring(my, { stiffness: 160, damping: 24 });
  const dotX = useSpring(mx, { stiffness: 700, damping: 44 });
  const dotY = useSpring(my, { stiffness: 700, damping: 44 });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!el.closest('button, a, [data-hover]'));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.body.style.cursor = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <>
      <motion.div
        className={`cursor-ring${hovering ? ' cursor-ring--hover' : ''}`}
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}
