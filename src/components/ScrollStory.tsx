import React, { useEffect, useRef, useState } from 'react';

const captions = [
  {
    tag: '01 · hola',
    title: 'Este es mi compañero de código',
    body: 'Baja despacio: la escena avanza con tu scroll.',
  },
  {
    tag: '02 · editor abierto',
    title: 'Cada línea se escribe con tu scroll',
    body: 'Sube y baja para ver cómo el código aparece y desaparece.',
  },
  {
    tag: '03 · compilando',
    title: 'Build exitoso. Entremos.',
    body: 'Dentro de la pantalla están mi historia y mis proyectos.',
  },
];

const ScrollStory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Three.js y GSAP se cargan aparte, solo cuando esta sección se hidrata
    import('../scripts/scrollStory')
      .then(({ initScrollStory }) => {
        if (cancelled || !sectionRef.current || !canvasRef.current) return;
        cleanup = initScrollStory({
          section: sectionRef.current,
          canvasHost: canvasRef.current,
          captions: captionRefs.current.filter(Boolean) as HTMLElement[],
          progressBar: progressRef.current,
          fadeOverlay: fadeRef.current,
        });
      })
      .catch((err) => {
        console.warn('Escena 3D desactivada:', err);
        setFailed(true);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (failed) return null;

  return (
    <section
      id="story"
      ref={sectionRef}
      aria-label="Escena 3D: un monito programando en una laptop"
      className="story-section relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Lienzo 3D */}
        <div ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

        {/* Textos que acompañan cada etapa */}
        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-7xl items-end px-6 pb-28 md:items-center md:pb-0 lg:px-8">
          <div className="relative h-44 w-full md:h-56 md:max-w-md">
            {captions.map((c, i) => (
              <div
                key={c.tag}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-0"
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
              >
                <div className="glass rounded-2xl p-6 md:bg-transparent md:p-0 md:backdrop-blur-none md:border-0">
                  <span className="inline-flex items-center gap-2.5 font-mono text-[13px] tracking-wide text-zinc-400">
                    <span className="h-px w-6 bg-zinc-600" aria-hidden="true" />
                    {c.tag}
                  </span>
                  <h2
                    className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-3xl md:text-[44px] md:leading-[1.1]"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {c.title}
                  </h2>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-zinc-400 md:text-[17px]">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-8 left-1/2 h-0.5 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left bg-white/75"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Fundido hacia la siguiente sección */}
        <div
          ref={fadeRef}
          className="pointer-events-none absolute inset-0 bg-dark-bg"
          style={{ opacity: 0 }}
        />
      </div>

      <style>{`
        .story-section { height: 420vh; }
        @media (max-width: 767px) { .story-section { height: 340vh; } }
        @media (prefers-reduced-motion: reduce) { .story-section { height: 100vh; } }
      `}</style>
    </section>
  );
};

export default ScrollStory;
