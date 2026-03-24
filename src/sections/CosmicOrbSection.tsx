import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CosmicScene from '../scene/CosmicScene';
import { useScrollStore } from '../animation/scrollStore';

gsap.registerPlugin(ScrollTrigger);

const CosmicOrbSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setProgress = useScrollStore((state) => state.setProgress);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%', // 4 viewport heights of scrolling
        pin: containerRef.current,
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress);
        }
      });
    });

    return () => ctx.revert();
  }, [setProgress]);

  return (
    <section ref={sectionRef} className="relative w-full">
      <div 
        ref={containerRef} 
        className="w-full h-screen overflow-hidden relative"
      >
        <div className="absolute inset-0 z-0">
          <CosmicScene />
        </div>
        
        {/* Minimal Editorial Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-12 lg:p-24">
          <div className="max-w-md">
            <h2 className="text-sm tracking-[0.2em] text-neutral-400 uppercase mb-4 font-light">Celestial Bodies</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-white/90">
              The cosmic orb's journey.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CosmicOrbSection;