const EMAIL = 'Stephanoescu@gmail.com';

const socials = [
  { name: 'GitHub', handle: '@Stephanoescu', url: 'https://github.com/Stephanoescu' },
  { name: 'LinkedIn', handle: '/in/stephano-espinoza-cueva', url: 'https://linkedin.com/in/stephano-espinoza-cueva' },
  { name: 'WhatsApp', handle: '+51 988 777 567', url: 'https://wa.me/51988777567' },
];

/** Contacto y pie de página (última sección dentro de la pantalla). */
const FooterSection = () => (
  <section id="contact" className="section">
    <div className="container">
      <span className="eyebrow">Contacto</span>
      <h2 className="title">¿Tienes un proyecto en mente?</h2>
      <p className="lead">
        Estoy disponible para proyectos freelance, oportunidades de tiempo completo o simplemente para conversar sobre
        tecnología.
      </p>

      <div className="contact">
        <div className="reveal">
          <div className="email">
            <span className="email__addr">{EMAIL}</span>
            <div className="email__actions">
              <button type="button" className="btn btn--sm" data-copy={EMAIL}>
                Copiar
              </button>
              <a className="btn btn--sm btn--primary" href={`mailto:${EMAIL}`}>
                Escribir
              </a>
            </div>
          </div>
        </div>
        <ul className="socials reveal">
          {socials.map((s) => (
            <li key={s.name}>
              <a className="social" href={s.url} target="_blank" rel="noopener noreferrer">
                <span className="social__name">{s.name}</span>
                <span className="social__handle">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">
        <span>© 2026 Stephano Espinoza Cueva</span>
        <span className="mono">Hecho en Lima, Perú · optimizado para 60 fps</span>
      </footer>
    </div>
  </section>
);

export default FooterSection;
