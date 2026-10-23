/** Portada. Es HTML estático: no necesita JavaScript en el navegador. */
const HeroSection = () => (
  <section id="home" className="hero">
    <div className="container">
      <p className="status">
        <span className="status__dot" aria-hidden="true" />
        Disponible para trabajar · Lima, Perú
      </p>
      <h1 className="hero__name">
        Stephano
        <br />
        Espinoza <span>Cueva</span>
      </h1>
      <p className="hero__role mono">Software Engineer · Frontend · Full Stack</p>
      <p className="hero__lead">
        Transformo ideas en código limpio y escalable. Me obsesiona la optimización: cada interfaz que construyo
        apunta a 60 FPS.
      </p>
      <div className="hero__actions">
        <a className="btn btn--primary" href="#projects">
          Ver proyectos
        </a>
        <a className="btn" href="#contact">
          Contactar
        </a>
      </div>
      <a className="hero__hint" href="#story">
        Baja para entrar a la laptop
      </a>
    </div>
  </section>
);

export default HeroSection;
