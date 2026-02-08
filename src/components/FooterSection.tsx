import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
  username: string;
}

const FooterSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('contact');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      url: 'https://github.com/stephanoec',
      color: '#00F7FF',
      username: '@stephanoec',
    },
    {
      name: 'LinkedIn',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      url: 'https://linkedin.com/in/stephano-espinoza',
      color: '#0077B5',
      username: '/in/stephano-espinoza',
    },
    {
      name: 'Twitter',
      icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
      url: 'https://twitter.com/stephano_ec',
      color: '#FF00E5',
      username: '@stephano_ec',
    },
    {
      name: 'Email',
      icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      url: 'mailto:stephano.espinoza@example.com',
      color: '#9D00FF',
      username: 'stephano.espinoza@example.com',
    },
  ];

  return (
    <footer id="contact" className="relative py-20 px-4 overflow-hidden border-t border-accent-blue/20">
      {/* Efectos de fondo - z-0 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2,1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 10 }}>
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">CONECTEMOS</span>
          </h2>
          <p className="text-xl text-gray-400 font-mono">
            {'>'} Siempre abierto a nuevas oportunidades y colaboraciones_
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-accent-blue via-blue-400 to-accent-blue mx-auto mt-6"></div>
        </motion.div>

        {/* Tarjeta de contacto principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-12 mb-16 text-center max-w-3xl mx-auto"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-6xl mb-6"
          >
            💻
          </motion.div>
          <h3 className="text-3xl font-bold mb-4 text-white">
            ¿Tienes un proyecto en mente?
          </h3>
          <p className="text-gray-400 text-lg mb-8">
            Estoy disponible para proyectos freelance, oportunidades de tiempo
            completo o simplemente para tomar un café virtual y hablar sobre
            tecnología.
          </p>
          <a
            href="mailto:stephano.espinoza@example.com"
            className="inline-flex items-center gap-3 btn-cyber text-lg px-8 py-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Envíame un mensaje
          </a>
        </motion.div>

        {/* Redes sociales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-white">
            Encuéntrame en:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
                className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 group"
              >
                {/* Icono */}
                <div className="flex items-center gap-4 mb-3">
                  <motion.div
                    className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `${social.color}20`,
                      border: `2px solid ${social.color}40`,
                    }}
                    animate={
                      hoveredSocial === social.name
                        ? {
                            rotate: [0, -10, 10, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill={social.color}
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>

                    {/* Brillo en hover */}
                    {hoveredSocial === social.name && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 0.6,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </motion.div>

                  <div>
                    <h4
                      className="font-bold text-lg group-hover:text-white transition-colors"
                      style={{ color: social.color }}
                    >
                      {social.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono">
                      {social.username}
                    </p>
                  </div>
                </div>

                {/* Indicador de link */}
                <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-accent-blue transition-colors">
                  <span>Visitar perfil</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={
                      hoveredSocial === social.name ? { x: [0, 5, 0] } : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </motion.svg>
                </div>

                {/* Borde brillante en hover */}
                {hoveredSocial === social.name && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${social.color}40`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent mb-8"></div>

        {/* Footer final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          {/* Firma */}
          <div className="mb-6">
            <p className="text-gray-400 text-lg font-mono mb-2">
              Creado con{' '}
              <span className="text-red-500 animate-pulse">💻</span>,{' '}
              <span className="text-yellow-600">☕</span> y un toque de{' '}
              <span className="gradient-text font-bold">locura cyberpunk</span>{' '}
              por Stephano
            </p>
          </div>

          {/* Código de copyright */}
          <div className="glass rounded-lg py-4 px-6 inline-block">
            <code className="text-sm font-mono text-gray-500">
              <span className="text-accent-blue">const</span> copyright ={' '}
              <span className="text-green-400">
                "© {new Date().getFullYear()} Stephano Espinoza Cueva"
              </span>
              ;
            </code>
          </div>

          {/* Stats del footer */}
          <motion.div
            className="mt-8 flex justify-center gap-6 text-xs font-mono text-gray-600"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistema Online</span>
            </div>
            <div>•</div>
            <div>Optimizado para 60 FPS</div>
            <div>•</div>
            <div>Made in 🇵🇪 Perú</div>
          </motion.div>

          {/* Scroll to top button */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8 w-12 h-12 rounded-full border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-300 flex items-center justify-center mx-auto hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
