import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('projects');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Proyectos reales del CV
  const projects: Project[] = [
    {
      id: 1,
      title: 'SecretarIA',
      description:
        'Agente IA de Atención al Cliente. Lideré el desarrollo de la arquitectura Frontend diseñando una interfaz intuitiva para la gestión y visualización de conversaciones automatizadas. Integración de LLMs y LangChain con WhatsApp API para orquestar flujos de atención al cliente.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      technologies: ['React', 'TypeScript', 'LangChain', 'WhatsApp API', 'OpenAI'],
      githubUrl: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'OsitoPolar',
      description:
        'Arquitectura de Microservicios & IoT. Solución tecnológica para la gestión de artefactos de refrigeración inteligente con integración de datos IoT para el monitoreo de temperatura y estado de dispositivos en tiempo real.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=600&fit=crop',
      technologies: ['Microservices', 'IoT', 'Node.js', 'MongoDB', 'Docker'],
      githubUrl: 'https://github.com/Inteligencia-Artesanal-FunArqui',
      featured: true,
    },
    {
      id: 3,
      title: 'VacApp',
      description:
        'AgroTech & Gestión Ganadera. Aplicación web integral para la digitalización de procesos ganaderos, integrando módulos de IoT para el conteo y geolocalización de ganado en tiempo real. Algoritmos de cálculo de productividad y rendimiento.',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      technologies: ['Vue.js', 'IoT', 'Python', 'PostgreSQL', 'Arduino'],
      githubUrl: 'https://github.com/1ASI0732-Grupo-3',
    },
    {
      id: 4,
      title: 'CoboxLogistic',
      description:
        'Logística Empresarial. Transformación digital de empresa de transporte, migrando la gestión operativa de cuadernos/Excel a aplicación web robusta. Módulos para seguimiento de flotas, gestión de inventarios y registro de rutas.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      technologies: ['Angular', 'Node.js', 'MySQL', 'Express', 'AWS'],
      githubUrl: 'https://github.com/Cobox-Logistic-OpenSource',
    },
    {
      id: 5,
      title: 'Diabelife',
      description:
        'Plataforma de Salud & Comunidad. Plataforma social y de gestión para pacientes con diabetes, incluyendo feed de publicaciones, sistema de gestión documental para visualización de análisis médicos y módulo de seguimiento nutricional.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'PDF.js'],
      githubUrl: 'https://github.com/upc-pre-202510-si0730-Grupo-Devspros',
    },
    {
      id: 6,
      title: 'HelpMom',
      description:
        'Telemedicina Materna. Aplicación web enfocada en el monitoreo pre y post embarazo. Sistema de chat en tiempo real (Socket.io) para comunicación directa entre pacientes y doctores. Gestión y visualización de recetas médicas digitales.',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop',
      technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'WebRTC'],
      githubUrl: 'https://github.com/HelpMom-AppWeb',
    },
  ];

  return (
    <section id="projects" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Efectos de fondo - z-0 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-accent-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 10 }}>
        {/* Título de sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">PROYECTOS DESTACADOS</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono">
            {'>'} Transformando ideas en realidades digitales_
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-blue-400 to-accent-blue mx-auto mt-6"></div>
        </motion.div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative ${
                project.featured ? 'lg:col-span-2' : ''
              }`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              {/* Tarjeta de proyecto */}
              <div className="relative bg-dark-card border border-accent-blue/20 rounded-2xl overflow-hidden h-full hover:scale-[1.02] transition-all duration-500 shadow-xl">
                {/* Badge de destacado */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-accent-green/20 backdrop-blur-sm text-accent-green text-xs font-mono rounded-full border border-accent-green/50">
                    DESTACADO
                  </div>
                )}

                {/* Imagen del proyecto */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-dark-card">
                  <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${project.image})`,
                    }}
                    animate={
                      activeProject === project.id
                        ? { scale: 1.1 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                  />

                  {/* Overlay con gradiente - más sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-dark-bg/20 to-transparent"></div>

                  {/* Efecto de escaneo en hover */}
                  {activeProject === project.id && (
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-accent-blue shadow-[0_0_10px_#3B82F6]"
                      initial={{ y: 0 }}
                      animate={{ y: '100vh' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}

                  {/* Botones de acción flotantes */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    animate={
                      activeProject === project.id
                        ? { scale: 1 }
                        : { scale: 0 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-accent-blue text-white font-bold rounded-lg hover:shadow-[0_0_20px_#3B82F6] transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-accent-green text-white font-bold rounded-lg hover:shadow-[0_0_20px_#10B981] transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </motion.div>
                </div>

                {/* Contenido del proyecto */}
                <div className="p-8 bg-dark-card border-t border-accent-blue/20">
                  {/* Título */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-accent-blue transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Línea divisora */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent mb-6"></div>

                  {/* Tecnologías */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-dark-section text-accent-blue text-sm font-mono rounded-full border border-accent-blue/30 hover:border-accent-blue hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Efecto de borde brillante en hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={
                    activeProject === project.id
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(0, 247, 255, 0)',
                            '0 0 20px rgba(0, 247, 255, 0.4)',
                            '0 0 40px rgba(0, 247, 255, 0.2)',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-dark-card border border-accent-blue/20 rounded-2xl p-8 inline-block">
            <p className="text-xl text-gray-300 mb-4 font-mono">
              ¿Quieres ver más proyectos?
            </p>
            <a
              href="https://github.com/Stephanoescu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-cyber"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Ver todos en GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
