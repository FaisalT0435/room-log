'use client';

import { useEffect, useRef } from 'react';

export default function Background() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.body.appendChild(s);
      });

    (async () => {
      try {
        // Load Three.js and Vanta dots plugin
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r124/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.dots.min.js');

        if (!vantaRef.current || !(window as any).VANTA?.DOTS) {
          console.error('VANTA DOTS not available');
          return;
        }

        vantaEffect.current = (window as any).VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xff001b,
          color2: 0xff2020,
          backgroundColor: 0xf7f7f7,
          size: 3.4,
          spacing: 32.0,
          showLines: false,
        });
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return <div ref={vantaRef} id="vanta-dots" className="fixed inset-0 -z-10" />;
}
