import { ABOUT_EYEBROW, ABOUT_TITLE } from '../scripts/insideLayout';

const stats = [
  { value: '4', label: 'años estudiando Ingeniería de Software' },
  { value: '5', label: 'proyectos destacados' },
  { value: '1.º', label: 'puesto Game Jam UPC 2022' },
  { value: '60', label: 'fps, la meta de cada interfaz' },
];

const facts = [
  { k: 'Rol', v: 'Software Engineer' },
  { k: 'Ubicación', v: 'Lima, Perú' },
  { k: 'Formación', v: 'Ingeniería de Software · Universidad Peruana de Ciencias Aplicadas' },
  { k: 'Enfoque', v: 'Arquitectura frontend, full stack, microservicios e IoT, integración de IA' },
  { k: 'Idiomas', v: 'Español (nativo) · Inglés (básico)' },
];

/** Primera sección dentro de la pantalla. Sus medidas superiores coinciden con la textura 3D. */
const AboutSection = () => (
  <section id="about" className="section section--first">
    <div className="container">
      <span className="eyebrow">{ABOUT_EYEBROW}</span>
      <h2 className="title">{ABOUT_TITLE}</h2>

      <div className="about">
        <div className="about__text reveal">
          <p>
            Soy <strong>Stephano Espinoza Cueva</strong>, desarrollador de software en Lima. Estudio Ingeniería de
            Software en la UPC, donde llevo cuatro años construyendo productos en equipo: plataformas de salud,
            logística, agrotech y sistemas con IoT y microservicios.
          </p>
          <p>
            Me especializo en arquitectura frontend y desarrollo full stack, y me interesan la optimización web, la IA
            generativa y Web3. Trabajo con una regla simple: que funcione, que esté bien hecho y que sea rápido.
          </p>
          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__value">{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="reveal">
          <div className="facts">
            <div className="facts__head">
              <span>developer.json</span>
              <span>~/stephano</span>
            </div>
            <dl>
              {facts.map((f) => (
                <div key={f.k} className="facts__row">
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="motto">
            <span>$</span> make it work, make it right, make it fast
          </p>
        </aside>
      </div>
    </div>
  </section>
);

export default AboutSection;
