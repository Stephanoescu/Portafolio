import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const roles = [
    '🇵🇪 Ingeniero de Software',
    'Frontend Architect',
    'Full Stack Developer',
    'Performance Obsessed',
    'Web3 Enthusiast',
    'AI Explorer',
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Efectos de fondo - z-0 */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {/* Círculos brillantes animados */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue opacity-3 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.03, 0.08],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Contenido principal - z-10 */}
      <motion.div
        className="relative max-w-6xl mx-auto text-center w-full"
        style={{ zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge de ubicación */}
        <motion.div variants={itemVariants} className="mb-8 inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-blue"></span>
            </span>
            <span className="text-sm font-mono text-accent-blue">
              Available for work • Lima, Perú
            </span>
          </div>
        </motion.div>

        {/* Nombre principal */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none"
        >
          <span className="block gradient-text">STEPHANO</span>
          <span className="block text-text-primary mt-2">
            ESPINOZA
            <span className="text-accent-blue ml-4">CUEVA</span>
          </span>
        </motion.h1>

        {/* Subtítulo con efecto de máquina de escribir */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="text-2xl md:text-4xl font-mono h-20 flex items-center justify-center">
            <span className="text-glow text-accent-blue">{text}</span>
            <span className="animate-pulse text-accent-blue ml-1">|</span>
          </div>
        </motion.div>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transformando <span className="text-accent-blue font-semibold">cafeína</span> en{' '}
          <span className="text-accent-green font-semibold">código limpio y escalable</span>.
          <br />
          Obsesionado con la optimización y los <span className="text-glow font-mono">60 FPS</span>.
        </motion.p>

        {/* Cubo 3D interactivo */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex justify-center"
        >
          <div className="relative w-32 h-32 perspective-1000">
            <motion.div
              className="w-full h-full preserve-3d"
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
            >
              {/* Caras del cubo */}
              {[
                { transform: 'rotateY(0deg) translateZ(64px)', bg: 'bg-accent-blue' },
                { transform: 'rotateY(90deg) translateZ(64px)', bg: 'bg-blue-500' },
                { transform: 'rotateY(180deg) translateZ(64px)', bg: 'bg-accent-blue' },
                { transform: 'rotateY(-90deg) translateZ(64px)', bg: 'bg-blue-500' },
                { transform: 'rotateX(90deg) translateZ(64px)', bg: 'bg-accent-blue' },
                { transform: 'rotateX(-90deg) translateZ(64px)', bg: 'bg-blue-500' },
              ].map((face, index) => (
                <div
                  key={index}
                  className={`absolute w-32 h-32 ${face.bg} bg-opacity-20 border-2 border-current flex items-center justify-center text-4xl font-bold`}
                  style={{ transform: face.transform }}
                >
                  {'</>'}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Botones CTA */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            className="btn-cyber group"
            onClick={() => scrollToSection('projects')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Ver Proyectos</span>
          </motion.button>

          <motion.button
            className="btn-cyber border-accent-green text-accent-green group"
            onClick={() => scrollToSection('contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Contactar</span>
          </motion.button>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          variants={itemVariants}
          className="mt-16"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <span className="text-sm font-mono text-gray-500">Scroll Down</span>
            <svg
              className="w-6 h-6 text-accent-blue"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .btn-cyber.border-accent-green::before {
          background: #10B981;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
