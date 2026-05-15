import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { stiffness: 700, damping: 44 });
  const dotY = useSpring(my, { stiffness: 700, damping: 44 });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.body.style.cursor = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return <motion.div className="cursor-dot" style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }} />;
}
