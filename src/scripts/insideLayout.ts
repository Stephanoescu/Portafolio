/**
 * Medidas compartidas entre el CSS de la "pantalla" (InsideScreen) y la
 * textura 3D de la laptop, para que al terminar la animación lo que se ve en
 * la pantalla 3D coincida con el contenido real.
 * Si cambias algo aquí, cambia también las variables en global.css.
 */
export const MOBILE_MAX = 767;
export const BAR_H = 44;
export const CONTENT_MAX = 1120;

export const isNarrow = (vw: number) => vw <= MOBILE_MAX;
export const bezelFor = (vw: number) => (isNarrow(vw) ? 8 : 14);
export const padFor = (vw: number) => (isNarrow(vw) ? 16 : 24);
export const firstSectionTopFor = (vw: number) => (isNarrow(vw) ? 56 : 88);
export const titleSizeFor = (vw: number) => (isNarrow(vw) ? 30 : 44);

export const TABS = [
  { id: 'about', label: 'Sobre mí' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'contact', label: 'Contacto' },
] as const;

export const ABOUT_EYEBROW = 'Sobre mí';
export const ABOUT_TITLE = 'Ingeniero de software enfocado en el rendimiento.';
export const ABOUT_TITLE_MAX = 640;

export const COLORS = {
  bg: '#0c0c0d',
  bar: '#111113',
  line: '#242427',
  bezel: '#060607',
  text: '#ededee',
  muted: '#a0a0a8',
  faint: '#6b6b73',
  dot: '#3a3a3e',
};
