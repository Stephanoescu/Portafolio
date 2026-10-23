import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TABS } from '../scripts/insideLayout';

/**
 * "Dentro de la laptop": un marco fijo (bisel + barra de ventana con pestañas)
 * que aparece justo cuando la cámara de la escena 3D llega a la pantalla.
 * Todo el contenido (Sobre mí, Skills, Proyectos, Contacto) se recorre aquí dentro.
 *
 * El contenedor empieza 100vh antes de que termine la escena (margin-top: -100vh),
 * así al final de la animación su parte superior coincide con la pantalla 3D.
 */
const FADE_PX = 160;

const InsideScreen = ({ children }: { children?: ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string>(TABS[0].id);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js-reveal');

    let insideOn = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = wrap.getBoundingClientRect().top;
      const o = reduced ? (top <= 1 ? 1 : 0) : Math.min(1, Math.max(0, 1 - top / FADE_PX));
      wrap.style.opacity = String(reduced ? 1 : o);
      // Mientras aparece, el contenido se mantiene alineado con la pantalla 3D
      wrap.style.transform = !reduced && top > 0 && top < FADE_PX ? `translateY(${-top}px)` : '';
      wrap.style.pointerEvents = o > 0.5 || reduced ? 'auto' : 'none';
      frame.style.opacity = String(o);
      frame.style.visibility = o > 0 ? 'visible' : 'hidden';
      const on = o > 0.5;
      if (on !== insideOn) {
        insideOn = on;
        window.dispatchEvent(new CustomEvent('inside-mode', { detail: on }));
      }
      // Pestaña activa según la sección visible
      const probe = window.innerHeight * 0.35;
      let current: string = TABS[0].id;
      for (const t of TABS) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= probe) current = t.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Aparición suave de bloques
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    wrap.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // Botones de copiar
    const onClick = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
      if (!btn) return;
      const text = btn.dataset.copy ?? '';
      const label = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado';
      } catch {
        const range = document.createRange();
        const target = wrap.querySelector('.email__addr');
        if (target) {
          range.selectNodeContents(target);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
        btn.textContent = 'Seleccionado';
      }
      window.setTimeout(() => (btn.textContent = label), 1600);
    };
    wrap.addEventListener('click', onClick);

    // Medidor de FPS real (solo mientras estamos dentro)
    let frames = 0;
    let last = performance.now();
    let fpsRaf = 0;
    const tick = (now: number) => {
      frames++;
      if (now - last >= 500) {
        const fps = Math.round((frames * 1000) / (now - last));
        // Solo se muestra cuando el equipo realmente va fluido
        if (fpsRef.current) {
          fpsRef.current.textContent = `${Math.min(fps, 120)} fps`;
          fpsRef.current.style.visibility = fps >= 50 ? 'visible' : 'hidden';
        }
        frames = 0;
        last = now;
      }
      fpsRaf = insideOn && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const onInside = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail && !fpsRaf) {
        frames = 0;
        last = performance.now();
        fpsRaf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener('inside-mode', onInside);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('inside-mode', onInside);
      wrap.removeEventListener('click', onClick);
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fpsRaf);
    };
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div ref={frameRef} className="device">
        <div className="device__glass" />
        <div className="device__cam" />
        <div className="device__bar">
          <div className="device__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <nav className="device__tabs" aria-label="Secciones">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`device__tab ${active === t.id ? 'is-active' : ''}`}
                aria-current={active === t.id ? 'true' : undefined}
                onClick={() => goTo(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="device__meta">
            <span className="device__url">stephano.dev</span>
            <span ref={fpsRef} className="device__fps" title="Cuadros por segundo medidos en tu navegador">
              60 fps
            </span>
          </div>
        </div>
      </div>
      <div ref={wrapRef} className="inside">
        {children}
      </div>
    </>
  );
};

export default InsideScreen;
