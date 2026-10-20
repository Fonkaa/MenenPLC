'use client';

import React, { useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'docking' | 'done';

// Logo for the dark intro screen + the original-colors logo used in the white navbar
const LOGO_DARK = '/images/menen-logo-original-colors.png';
const LOGO_LIGHT = '/images/menen-logo-original-colors.png';

const INTRO_MS = 2600; // hero moment before the logo flies
const DOCK_MS = 1300; // flight time into the navbar
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'; // cinematic ease-in-out

const REVEAL_CSS = `
@keyframes menenLogoIn {
  from { opacity: 0; transform: scale(0.92); filter: blur(16px); }
  to   { opacity: 1; transform: scale(1);    filter: blur(0); }
}
@keyframes menenShine {
  from { transform: translateX(-130%) skewX(-18deg); }
  to   { transform: translateX(380%)  skewX(-18deg); }
}
@keyframes menenLine {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes menenGlow {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.08); }
}
.menen-logo-in { animation: menenLogoIn 1500ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both; }
.menen-shine   { animation: menenShine 1500ms cubic-bezier(0.45, 0, 0.2, 1) 1100ms both; }
.menen-line    { animation: menenLine 2300ms cubic-bezier(0.65, 0, 0.35, 1) 300ms both; }
.menen-glow    { animation: menenGlow 4200ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .menen-logo-in, .menen-shine, .menen-line, .menen-glow { animation-duration: 1ms; animation-delay: 0ms; }
}
`;

export default function OpeningLogoReveal() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [dock, setDock] = useState({ x: 0, y: 0, s: 1 });
  const logoRef = useRef<HTMLDivElement>(null);

  // Keep the page still while the intro plays
  useEffect(() => {
    if (phase === 'done') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introMs = reduceMotion ? 500 : INTRO_MS;
    const dockMs = reduceMotion ? 200 : DOCK_MS;

    const findNavLogo = () =>
      document.querySelector<HTMLImageElement>('header img[alt="MENEN Logo"]');

    // Hide the real navbar logo so only ONE logo exists while the intro flies
    const navLogo = findNavLogo();
    if (navLogo) {
      navLogo.style.transition = 'none';
      navLogo.style.opacity = '0';
    }

    // Measure exactly where the navbar logo sits, then fly there (FLIP-style)
    const startDocking = () => {
      const el = logoRef.current;
      if (el) {
        const from = el.getBoundingClientRect();
        const target = findNavLogo()?.getBoundingClientRect();
        let tw: number, tx: number, ty: number;
        if (target && target.width > 0) {
          tw = target.width;
          tx = target.left + target.width / 2;
          ty = target.top + target.height / 2;
        } else {
          tw = from.width * 0.22;
          tx = 90 + tw / 2;
          ty = 40;
        }
        setDock({
          s: tw / from.width,
          x: tx - (from.left + from.width / 2),
          y: ty - (from.top + from.height / 2),
        });
      }
      setPhase('docking');
    };

    const t1 = setTimeout(startDocking, introMs);

    // Reveal the real navbar logo a hair before landing (it sits exactly under the flying one)
    const t2 = setTimeout(() => {
      const real = findNavLogo();
      if (real) {
        real.style.transition = 'none';
        real.style.opacity = '1';
      }
    }, introMs + dockMs - 60);

    const t3 = setTimeout(() => setPhase('done'), introMs + dockMs + 80);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      const real = findNavLogo();
      if (real) {
        real.style.transition = '';
        real.style.opacity = '';
      }
    };
  }, []);

  if (phase === 'done') return null;

  const docking = phase === 'docking';

  return (
    <>
      <style>{REVEAL_CSS}</style>

      {/* CURTAIN: warm dark stage that lifts away upward while the logo flies to the navbar */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        style={{
          background: '#1a1714',
          clipPath: docking ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)',
          transition: `clip-path ${DOCK_MS}ms ${EASE} 120ms`,
        }}
      >
        {/* Brand-colored ambient glow */}
        <div
          className="menen-glow absolute inset-0"
          style={{
            background:
              'radial-gradient(48% 40% at 50% 50%, rgba(124,200,172,0.13) 0%, rgba(58,123,213,0.08) 38%, rgba(26,23,20,0) 72%)',
          }}
        />
        {/* Soft vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* LOGO LAYER */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
        {/* Docking wrapper: owns the fly-to-navbar transform */}
        <div
          ref={logoRef}
          className="relative w-[min(74vw,26rem)] sm:w-[min(56vw,34rem)]"
          style={{
            transform: docking
              ? `translate3d(${dock.x}px, ${dock.y}px, 0) scale(${dock.s})`
              : 'translate3d(0,0,0) scale(1)',
            transition: docking ? `transform ${DOCK_MS}ms ${EASE}` : 'none',
            willChange: 'transform',
          }}
        >
          {/* Intro wrapper: blur-in + scale-in */}
          <div className="menen-logo-in relative">
            {/* Dark-stage logo (fades out mid-flight) */}
            <img
              src={LOGO_DARK}
              alt="MENEN Engineering PLC"
              draggable={false}
              className="relative block w-full h-auto select-none"
              style={{
                opacity: docking ? 0 : 1,
                transition: `opacity 650ms ease-in-out ${docking ? '300ms' : '0ms'}`,
              }}
            />
            {/* Navbar-colors logo (fades in mid-flight so it lands identical to the navbar) */}
            <img
              src={LOGO_LIGHT}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 block w-full h-auto select-none"
              style={{
                opacity: docking ? 1 : 0,
                transition: `opacity 650ms ease-in-out ${docking ? '300ms' : '0ms'}`,
              }}
            />

            {/* Light sweep, masked to the logo's own shape */}
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                WebkitMaskImage: `url(${LOGO_DARK})`,
                maskImage: `url(${LOGO_DARK})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                opacity: docking ? 0 : 1,
                transition: 'opacity 300ms',
              }}
            >
              <div
                className="menen-shine absolute top-0 bottom-0 left-0 w-1/3"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
                }}
              />
            </div>
          </div>

          {/* Hairline progress in the three brand colors */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 -bottom-8 sm:-bottom-10 h-px bg-white/10 overflow-hidden"
            style={{ opacity: docking ? 0 : 1, transition: 'opacity 350ms' }}
          >
            <div
              className="menen-line h-full w-full origin-left"
              style={{
                background: 'linear-gradient(90deg, #3A7BD5 0%, #14A89E 55%, #7CC8AC 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}