interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'OsitoPolar',
    category: 'Microservicios e IoT',
    description:
      'Gestión de artefactos de refrigeración inteligente, con datos IoT para monitorear la temperatura y el estado de cada dispositivo en tiempo real.',
    technologies: ['C#', 'Angular', 'Microservicios'],
    githubUrl: 'https://github.com/Inteligencia-Artesanal-FunArqui',
    featured: true,
  },
  {
    title: 'VacApp',
    category: 'AgroTech y gestión ganadera',
    description:
      'Digitaliza los procesos ganaderos: módulos IoT para contar y geolocalizar ganado en tiempo real y cálculos de productividad y rendimiento.',
    technologies: ['C#', 'Dart', 'TypeScript', 'Vue'],
    githubUrl: 'https://github.com/1ASI0732-Grupo-3',
  },
  {
    title: 'CoboxLogistic',
    category: 'Logística empresarial',
    description:
      'Transformación digital de una empresa de transporte que pasó de cuadernos y Excel a una aplicación web con seguimiento de flotas, inventarios y rutas.',
    technologies: ['Java', 'Angular', 'TypeScript', 'HTML'],
    githubUrl: 'https://github.com/Cobox-Logistic-OpenSource',
  },
  {
    title: 'Diabelife',
    category: 'Salud y comunidad',
    description:
      'Plataforma social para pacientes con diabetes: feed de publicaciones, gestión de análisis médicos y seguimiento nutricional.',
    technologies: ['Vue', 'JavaScript', 'C#', 'HTML'],
    githubUrl: 'https://github.com/upc-pre-202510-si0730-Grupo-Devspros',
  },
  {
    title: 'HelpMom',
    category: 'Telemedicina materna',
    description:
      'Monitoreo antes y después del embarazo, con chat en tiempo real entre pacientes y doctores y recetas médicas digitales.',
    technologies: ['Vue', 'JavaScript', 'C#', 'HTML'],
    githubUrl: 'https://github.com/HelpMom-AppWeb',
  },
];

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l5-5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProjectsSection = () => (
  <section id="projects" className="section">
    <div className="container">
      <span className="eyebrow">Proyectos</span>
      <h2 className="title">Trabajo seleccionado</h2>
      <p className="lead">Productos construidos en equipo durante la carrera, de la idea al despliegue.</p>

      <div className="projects">
        {projects.map((p) => (
          <article key={p.title} className="project reveal">
            <div className="project__cat">
              {p.category}
              {p.featured && <span className="tag">Destacado</span>}
            </div>
            <div>
              <h3 className="project__title">{p.title}</h3>
              <p className="project__desc">{p.description}</p>
            </div>
            <div className="project__side">
              <ul className="chips">
                {p.technologies.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <a className="link" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                Ver repositorio <Arrow />
              </a>
              {p.demoUrl && (
                <a className="link" href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                  Ver demo <Arrow />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="projects__more">
        <a className="btn" href="https://github.com/Stephanoescu" target="_blank" rel="noopener noreferrer">
          Ver todos en GitHub <Arrow />
        </a>
      </div>
    </div>
  </section>
);

export default ProjectsSection;
