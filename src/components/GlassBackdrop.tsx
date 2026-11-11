'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// three.js only runs in the browser.
const Creature = dynamic(() => import('./Creature'), { ssr: false });

// Dusk haze, with a mint "dawn" layer whose opacity follows scroll progress.
export default function GlassBackdrop() {
  const dawnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const m = document.documentElement.scrollHeight - window.innerHeight;
      const p = m > 0 ? Math.max(0, Math.min(1, window.scrollY / m)) : 0;
      if (dawnRef.current) dawnRef.current.style.opacity = Math.max(0, (p - 0.45) / 0.55).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div className="haze dusk" aria-hidden="true" />
      <div className="haze dawn" ref={dawnRef} aria-hidden="true" />
      <Creature />
    </>
  );
}
