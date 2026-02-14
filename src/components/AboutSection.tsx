import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('about');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const codeLines = [
    '  "name": "Stephano Espinoza Cueva",',
    '  "role": "Software Engineer",',
    '  "location": "Lima, Perú 🇵🇪",',
    '  "university": "Universidad Peruana De Ciencias Aplicadas",',
    '  "degree": "Ingeniería de Software - 4 años de estudio",',
    '  "bio": "Ingeniero obsesionado con la optimización,",',
    '  "passion": "transformando ideas en código limpio y escalable",',
    '  "specialties": [',
    '    "Frontend Architecture",',
    '    "Full Stack Development",',
    '    "Microservices & IoT",',
    '    "AI Integration"',
    '  ],',
    '  "interests": [',
    '    "Web Performance Optimization",',
    '    "IA Generativa",',
    '    "Web3 & Blockchain",',
    '    "Full Stack Engineering"',
    '  ],',
    '  "languages": {',
    '    "spanish": "Nativo",',
    '    "english": "Básico"',
    '  },',
    '  "funFact": "Ganador 1er Puesto Game Jam UPC 2022 🏆",',
    '  "goal": "Siempre buscando los 60 FPS ⚡",',
    '  "philosophy": "Clean code is not written by following a set of rules.",',
    '  "motto": "Make it work, make it right, make it fast"',
  ];

  return (
    <section id="about" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Efectos de fondo - z-0 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-blue opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 10 }}>
        {/* Título de sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">{'<'} ABOUT_ME {'>'}</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-blue-400 to-accent-blue mx-auto"></div>
        </motion.div>

        {/* Terminal de código */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-lg overflow-hidden shadow-2xl max-w-4xl mx-auto"
        >
          {/* Barra superior del terminal */}
          <div className="bg-dark-card border-b border-accent-blue/20 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">~/developer/stephano</span>
            </div>
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>

          {/* Contenido del terminal */}
          <div className="p-8 font-mono text-sm md:text-base bg-dark-section">
            {/* Comando */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-accent-blue">$</span>
              <span className="text-gray-300">cat</span>
              <span className="text-accent-green">developer.json</span>
            </div>

            {/* JSON Output */}
            <div className="pl-4">
              <div className="text-gray-300">
                <span className="text-text-secondary">{'{'}</span>
              </div>

              {codeLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="pl-4"
                >
                  {line.includes('[') || line.includes(']') ? (
                    <span className="text-text-secondary">{line}</span>
                  ) : line.includes(':') ? (
                    <>
                      <span className="text-accent-blue">
                        {line.split(':')[0]}:
                      </span>
                      <span className="text-green-400">
                        {line.split(':')[1]}
                      </span>
                    </>
                  ) : (
                    <span className="text-green-400">{line}</span>
                  )}
                </motion.div>
              ))}

              <div className="text-gray-300">
                <span className="text-text-secondary">{'}'}</span>
              </div>
            </div>

            {/* Cursor parpadeante */}
            <motion.div
              className="inline-block w-2 h-5 bg-accent-blue ml-1 mt-4"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          {/* Footer del terminal con estadísticas */}
          <div className="bg-dark-card border-t border-accent-blue/20 px-6 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent-blue">4</div>
                <div className="text-xs text-gray-400 font-mono">Años de estudio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-green">6+</div>
                <div className="text-xs text-gray-400 font-mono">Proyectos destacados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-blue">∞</div>
                <div className="text-xs text-gray-400 font-mono">Líneas de código</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">60 FPS</div>
                <div className="text-xs text-gray-400 font-mono">Obsesión constante</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Líneas de código decorativas */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-mono">
          {[
            'while(alive) { eat(); sleep(); code(); repeat(); }',
            'const passion = learning + building + optimizing;',
            'if (motivated === true) { code(); innovate(); }',
          ].map((code, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              className="px-4 py-2 glass rounded-full text-accent-blue hover:scale-105 transition-transform cursor-default"
            >
              {code}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
