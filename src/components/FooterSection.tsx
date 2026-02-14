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
      url: 'https://github.com/Stephanoescu',
      color: '#00F7FF',
      username: '@Stephanoescu',
    },
    {
      name: 'LinkedIn',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      url: 'https://linkedin.com/in/stephano-espinoza-cueva',
      color: '#0077B5',
      username: '/in/stephano-espinoza-cueva',
    },
    {
      name: 'WhatsApp',
      icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
      url: 'https://wa.me/51988777567',
      color: '#25D366',
      username: '+51 988777567',
    },
    {
      name: 'Email',
      icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      url: 'mailto:Stephanoescu@gmail.com',
      color: '#9D00FF',
      username: 'Stephanoescu@gmail.com',
    },
  ];

  return (
    <footer id="contact" className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden border-t border-accent-blue/20">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
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
            completo o simplemente para conversar sobre
            tecnología.
          </p>
          <a
            href="mailto:Stephanoescu@gmail.com"
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
              Creado por Stephano
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
