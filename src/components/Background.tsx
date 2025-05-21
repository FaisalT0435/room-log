// File: src/app/components/Background.tsx

'use client';

import { useRef, useEffect } from 'react';

export default function Background() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Helper to load external scripts
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load ${src}`);
        document.head.appendChild(script);
      });

    // Sequentially load Three.js and Vanta
    (async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.birds.min.js');

        if (vantaRef.current && !(window as any).VANTA) {
          console.error('VANTA library not found on window');
          return;
        }

        // @ts-ignore
        vantaEffect.current = (window as any).VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xffffff,
          color2: 0xe3b531,
          colorMode: 'lerp',
          birdSize: 0.8,
          wingSpan: 23.0,
          separation: 21.0,
          quantity: 4.0,
          backgroundAlpha: 0.66,
        });
      } catch (err) {
        console.error('Vanta initialization error:', err);
      }
    })();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return <div ref={vantaRef} id="vanta-bg" className="fixed inset-0 -z-10" />;
}
