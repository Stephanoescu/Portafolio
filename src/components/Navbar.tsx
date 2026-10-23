import { useEffect, useState } from 'react';

const links = [
  { href: '#about', label: 'Sobre mí' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#contact', label: 'Contacto' },
];

/**
 * Barra superior para el Hero y la escena 3D.
 * Se oculta cuando entramos a la pantalla de la laptop, porque ahí
 * la barra de la ventana (con pestañas) cumple la misma función.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [inside, setInside] = useState(false);
  const [diving, setDiving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onInside = (e: Event) => setInside((e as CustomEvent<boolean>).detail);
    const onDive = (e: Event) => setDiving((e as CustomEvent<boolean>).detail);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('inside-mode', onInside);
    window.addEventListener('story-dive', onDive);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('inside-mode', onInside);
      window.removeEventListener('story-dive', onDive);
    };
  }, []);

  const hidden = inside || diving;
  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  const cls = ['nav', scrolled || open ? 'is-scrolled' : '', hidden ? 'is-hidden' : ''].join(' ');

  return (
    <header className={cls}>
      <div className="container nav__inner">
        <a href="#home" className="nav__brand">
          Stephano Espinoza <span>/ dev</span>
        </a>
        <nav className="nav__links" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--sm" style={{ marginLeft: 8 }}>
            Contrátame
          </a>
        </nav>
        <button
          type="button"
          className="nav__menu-btn"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>
      <nav id="nav-sheet" className={`nav__sheet ${open ? 'is-open' : ''}`} aria-label="Principal móvil">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nav__link" onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
