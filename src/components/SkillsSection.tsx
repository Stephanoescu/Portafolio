import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  icon: string;
  color: string;
  level: number;
}

interface SkillCategory {
  title: string;
  emoji: string;
  skills: Skill[];
  highlight?: boolean;
}

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('skills');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const skillCategories: SkillCategory[] = [
    {
      title: 'Core & Lenguajes',
      emoji: '🚀',
      skills: [
        { name: 'JavaScript', icon: 'JS', color: '#F7DF1E', level: 95 },
        { name: 'TypeScript', icon: 'TS', color: '#3178C6', level: 90 },
        { name: 'Python', icon: 'PY', color: '#3776AB', level: 85 },
        { name: 'C++', icon: 'C++', color: '#00599C', level: 80 },
      ],
    },
    {
      title: 'Frontend Mastery',
      emoji: '💎',
      highlight: true,
      skills: [
        { name: 'React', icon: '⚛️', color: '#61DAFB', level: 95 },
        { name: 'Angular', icon: 'NG', color: '#DD0031', level: 90 },
        { name: 'Vue', icon: 'VUE', color: '#4FC08D', level: 88 },
        { name: 'Astro', icon: '🚀', color: '#FF5D01', level: 85 },
        { name: 'HTML5', icon: 'H5', color: '#E34F26', level: 98 },
        { name: 'CSS3', icon: 'C3', color: '#1572B6', level: 95 },
        { name: 'Tailwind', icon: 'TW', color: '#06B6D4', level: 95 },
        { name: 'Bootstrap', icon: 'BS', color: '#7952B3', level: 90 },
      ],
    },
    {
      title: 'Backend & Mobile',
      emoji: '🔧',
      skills: [
        { name: 'Node.js', icon: 'NODE', color: '#339933', level: 90 },
        { name: 'Flutter', icon: 'FL', color: '#02569B', level: 85 },
        { name: 'Dart', icon: 'DART', color: '#0175C2', level: 85 },
        { name: 'Android', icon: 'AND', color: '#3DDC84', level: 80 },
      ],
    },
    {
      title: 'Database & DevOps',
      emoji: '💾',
      skills: [
        { name: 'MongoDB', icon: 'MDB', color: '#47A248', level: 88 },
        { name: 'MySQL', icon: 'SQL', color: '#4479A1', level: 85 },
        { name: 'PostgreSQL', icon: 'PG', color: '#4169E1', level: 85 },
        { name: 'SQL Server', icon: 'MSSQL', color: '#CC2927', level: 80 },
        { name: 'AWS', icon: 'AWS', color: '#FF9900', level: 82 },
        { name: 'Docker', icon: '🐳', color: '#2496ED', level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="relative py-32 px-4 overflow-hidden">
      {/* Efectos de fondo - z-0 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 10 }}>
        {/* Título de sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">ARSENAL TECNOLÓGICO</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono">
            {'>'} Las herramientas que dominó para crear experiencias extraordinarias_
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-blue-400 to-accent-blue mx-auto mt-6"></div>
        </motion.div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className={`glass rounded-2xl p-8 ${
                category.highlight
                  ? 'neon-border lg:col-span-2 bg-gradient-to-br from-cyber-dark/80 to-cyber-gray/50'
                  : ''
              }`}
            >
              {/* Título de categoría */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-4xl">{category.emoji}</span>
                <h3
                  className={`text-2xl md:text-3xl font-bold ${
                    category.highlight ? 'gradient-text' : 'text-white'
                  }`}
                >
                  {category.title}
                </h3>
                {category.highlight && (
                  <span className="ml-auto px-3 py-1 bg-accent-blue/10 text-accent-blue text-xs font-mono rounded-full border border-accent-blue/30">
                    DESTACADO
                  </span>
                )}
              </div>

              {/* Grid de skills */}
              <div
                className={`grid gap-4 ${
                  category.highlight
                    ? 'grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-2 md:grid-cols-2'
                }`}
              >
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.3 },
                    }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                    className="relative group cursor-pointer"
                  >
                    {/* Tarjeta de skill */}
                    <div className="bg-dark-card/70 backdrop-blur-sm rounded-xl p-4 border border-border-subtle group-hover:border-accent-blue transition-all duration-300 h-full flex flex-col items-center justify-center gap-3">
                      {/* Ícono */}
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}10)`,
                          border: `2px solid ${skill.color}40`,
                        }}
                      >
                        <span style={{ color: skill.color }}>{skill.icon}</span>

                        {/* Efecto de brillo en hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                          animate={
                            hoveredSkill === skill.name
                              ? {
                                  x: ['-100%', '100%'],
                                }
                              : {}
                          }
                          transition={{
                            duration: 0.6,
                            ease: 'easeInOut',
                          }}
                        />
                      </div>

                      {/* Nombre */}
                      <div className="text-center">
                        <div className="font-semibold text-white group-hover:text-accent-blue transition-colors">
                          {skill.name}
                        </div>

                        {/* Barra de nivel */}
                        <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isVisible ? { width: `${skill.level}%` } : {}}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                              ease: 'easeOut',
                            }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                            }}
                          />
                        </div>

                        {/* Porcentaje en hover */}
                        {hoveredSkill === skill.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-xs font-mono"
                            style={{ color: skill.color }}
                          >
                            {skill.level}%
                          </motion.div>
                        )}
                      </div>

                      {/* Efecto de glow en hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          boxShadow: `0 0 20px ${skill.color}40, inset 0 0 20px ${skill.color}10`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Marcador de categoría destacada */}
              {category.highlight && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-6 text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green/10 rounded-full border border-accent-green/30">
                    <svg
                      className="w-5 h-5 text-accent-green"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-mono text-accent-green">
                      Mi pasión y especialidad principal
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer de stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <div className="font-mono text-gray-400 mb-4">
            <span className="text-accent-blue">const</span> totalSkills ={' '}
            <span className="text-accent-green">
              {skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)}
            </span>
            ;
          </div>
          <div className="text-sm text-gray-500">
            "Siempre aprendiendo, siempre evolucionando, siempre optimizando"
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
