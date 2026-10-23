interface SkillSet {
  name: string;
  items: string[];
  specialty?: boolean;
}

const skillSets: SkillSet[] = [
  {
    name: 'Frontend',
    specialty: true,
    items: ['React', 'Angular', 'Vue', 'Astro', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    name: 'Arquitectura e integraciones',
    specialty: true,
    items: ['API REST', 'Microservicios', 'History API', 'DDD'],
  },
  {
    name: 'Lenguajes',
    items: ['JavaScript', 'TypeScript', 'Python', 'C#', 'C++', 'Dart'],
  },
  {
    name: 'Backend y cloud',
    items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQL Server', 'Docker', 'AWS (básico)'],
  },
  {
    name: 'Móvil',
    items: ['Flutter', 'Android (Kotlin / Java)'],
  },
  {
    name: 'Herramientas',
    items: ['Git y GitHub', 'VS Code', 'Antigravity', 'Figma', 'Postman'],
  },
];

const SkillsSection = () => (
  <section id="skills" className="section">
    <div className="container">
      <span className="eyebrow">Skills</span>
      <h2 className="title">Las herramientas con las que trabajo</h2>
      <p className="lead">Mi fuerte es el frontend, pero me muevo cómodo en todo el stack, desde la base de datos hasta el despliegue.</p>

      <div className="skills reveal">
        {skillSets.map((set) => (
          <div key={set.name} className="skillset">
            <div className="skillset__head">
              <h3 className="skillset__name">{set.name}</h3>
              {set.specialty && <span className="tag">Especialidad</span>}
            </div>
            <ul className="chips">
              {set.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
