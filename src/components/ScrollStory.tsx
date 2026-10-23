import { useEffect, useRef, useState } from 'react';

const captions = [
  {
    tag: 'hola',
    title: 'Este es mi compañero de código',
    body: 'Baja despacio: la escena avanza con tu scroll.',
  },
  {
    tag: 'editor abierto',
    title: 'Cada línea se escribe con tu scroll',
    body: 'Sube y baja para ver cómo el código aparece y desaparece.',
  },
  {
    tag: 'compilando',
    title: 'Build exitoso. Entremos.',
    body: 'Todo lo que sigue vive dentro de esta pantalla.',
  },
];

const ScrollStory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
    <section id="story" ref={sectionRef} className="story" aria-label="Escena 3D: un monito programando en una laptop">
      <div className="story__sticky">
        <div ref={canvasRef} className="story__canvas" aria-hidden="true" />
        <div className="story__captions">
          <div className="container">
            {captions.map((c, i) => (
              <div
                key={c.tag}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="caption"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <span className="caption__tag">{c.tag}</span>
                <h2 className="caption__title">{c.title}</h2>
                <p className="caption__body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="story__progress" aria-hidden="true">
          <div ref={progressRef} />
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
