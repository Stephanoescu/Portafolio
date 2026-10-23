import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ABOUT_EYEBROW,
  ABOUT_TITLE,
  ABOUT_TITLE_MAX,
  BAR_H,
  COLORS,
  CONTENT_MAX,
  TABS,
  bezelFor,
  firstSectionTopFor,
  isNarrow,
  padFor,
  titleSizeFor,
} from './insideLayout';

gsap.registerPlugin(ScrollTrigger);

/**
 * Escena 3D controlada por scroll:
 *  1. El escritorio gira y entra a escena; el monito mira a la cámara.
 *  2. Se abre la laptop y el monito programa (el código se escribe con el scroll).
 *  3. La cámara pasa sobre su hombro y entra a la pantalla.
 */

export interface ScrollStoryOptions {
  section: HTMLElement;
  canvasHost: HTMLElement;
  captions?: HTMLElement[];
  progressBar?: HTMLElement | null;
}

type Segment = [string, string];

// Tema del editor: sobrio, de bajo contraste
const C = {
  bg: '#111214',
  bar: '#18191c',
  text: '#d4d4d8',
  muted: '#5f6168',
  key: '#b4a7d6',
  fn: '#8fb4d9',
  str: '#a3c9a8',
  num: '#d9b38c',
};

const CODE: Segment[][] = [
  [['// stephano.dev  —  scroll para compilar', C.muted]],
  [['const ', C.key], ['stephano', C.fn], [' = {', C.text]],
  [['  role: ', C.text], ['"Software Engineer"', C.str], [',', C.text]],
  [['  frontend: [', C.text], ['"React"', C.str], [', ', C.text], ['"Angular"', C.str], [', ', C.text], ['"Vue"', C.str], ['],', C.text]],
  [['  backend: [', C.text], ['"Node"', C.str], [', ', C.text], ['"C#"', C.str], [', ', C.text], ['"SQL"', C.str], ['],', C.text]],
  [['  obsession: ', C.text], ['60', C.num], [', ', C.text], ['// FPS', C.muted]],
  [['};', C.text]],
  [['', C.text]],
  [['function ', C.key], ['build', C.fn], ['(idea) {', C.text]],
  [['  return ', C.key], ['optimize', C.fn], ['(', C.text], ['clean', C.fn], ['(', C.text], ['code', C.fn], ['(idea)));', C.text]],
  [['}', C.text]],
  [['', C.text]],
  [['build', C.fn], ['(', C.text], ['"tu próximo proyecto"', C.str], [');', C.text]],
];
const TOTAL_CHARS = CODE.reduce((n, line) => n + line.reduce((m, [s]) => m + s.length, 0) + 1, 0);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Textura procedural de pelaje (trazos cortos) para darle relieve al pelo. */
function makeFurTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const l = 4 + Math.random() * 7;
    const v = 90 + Math.floor(Math.random() * 90);
    ctx.strokeStyle = `rgb(${v},${v},${v})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 2, y + l);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

export function initScrollStory(opts: ScrollStoryOptions): () => void {
  const { section, canvasHost, captions = [], progressBar } = opts;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const useShadows = !isMobile;

  // ---------- Renderer ----------
  const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = useShadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 50 : 36, 1, 0.05, 60);

  // Iluminación de estudio neutra (reflejos realistas en el aluminio)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf2f2f2, 0x1a1a1a, 0.35));
  const key = new THREE.DirectionalLight(0xfff3e6, 2.1);
  key.position.set(3.5, 6.5, 4.5);
  key.castShadow = useShadows;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8d3e6, 0.9);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const screenLight = new THREE.PointLight(0xdbe7ff, 0, 5, 2);
  scene.add(screenLight);

  // ---------- Helpers ----------
  const disposables: { dispose: () => void }[] = [envTex];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };
  const std = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    track(new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...extra }));
  const phys = (color: number, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
    track(new THREE.MeshPhysicalMaterial({ color, roughness: 0.6, metalness: 0, ...extra }));
  const geo = <T extends THREE.BufferGeometry>(g: T) => track(g);
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };

  // ---------- Escritorio ----------
  const desk = new THREE.Group();
  scene.add(desk);

  const deskTop = mesh(
    geo(new RoundedBoxGeometry(5.6, 0.12, 3.4, 3, 0.04)),
    std(0x2b2926, { roughness: 0.75 }),
    desk,
    0,
    -0.06,
    0,
  );
  deskTop.receiveShadow = true;
  const legMat = std(0x1c1c1e, { metalness: 0.6, roughness: 0.4 });
  const legGeo = geo(new THREE.BoxGeometry(0.06, 1.6, 0.06));
  [[-2.6, -1.5], [2.6, -1.5], [-2.6, 1.5], [2.6, 1.5]].forEach(([x, z]) => mesh(legGeo, legMat, desk, x, -0.92, z));

  // Taza
  const mug = new THREE.Group();
  mug.position.set(2.0, 0, 0.75);
  desk.add(mug);
  const ceramic = std(0xe8e5df, { roughness: 0.35, side: THREE.DoubleSide });
  mesh(geo(new THREE.CylinderGeometry(0.15, 0.14, 0.32, 32, 1, true)), ceramic, mug, 0, 0.16, 0);
  mesh(geo(new THREE.CircleGeometry(0.14, 32)), ceramic, mug, 0, 0.005, 0).rotation.x = -Math.PI / 2;
  mesh(geo(new THREE.CircleGeometry(0.145, 32)), std(0x2a1a10, { roughness: 0.15 }), mug, 0, 0.27, 0).rotation.x = -Math.PI / 2;
  const handle = mesh(geo(new THREE.TorusGeometry(0.085, 0.022, 10, 20, Math.PI)), ceramic, mug, 0.15, 0.16, 0);
  handle.rotation.z = -Math.PI / 2;

  // Planta
  const pot = new THREE.Group();
  pot.position.set(-2.15, 0, -0.95);
  desk.add(pot);
  mesh(geo(new THREE.CylinderGeometry(0.19, 0.16, 0.32, 24)), std(0x8a8884, { roughness: 0.9 }), pot, 0, 0.16, 0);
  mesh(geo(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 24)), std(0x2b2118, { roughness: 1 }), pot, 0, 0.31, 0);
  const leafMat = std(0x5f7a5b, { roughness: 0.55 });
  const leafGeo = geo(new THREE.SphereGeometry(0.1, 12, 8));
  for (let i = 0; i < 9; i++) {
    const ang = (i / 9) * Math.PI * 2;
    const tilt = 0.5 + (i % 3) * 0.2;
    const leaf = mesh(leafGeo, leafMat, pot, Math.cos(ang) * 0.09, 0.42 + (i % 3) * 0.08, Math.sin(ang) * 0.09);
    leaf.scale.set(0.35, 1.6, 0.9);
    leaf.rotation.set(Math.sin(ang) * tilt, 0, -Math.cos(ang) * tilt);
  }

  // Libreta y lápiz
  const notebook = mesh(geo(new RoundedBoxGeometry(0.75, 0.04, 1.0, 2, 0.015)), std(0x3d4148, { roughness: 0.8 }), desk, 1.9, 0.02, -0.55);
  notebook.rotation.y = 0.25;
  const pen = mesh(geo(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 12)), std(0xb8bcc2, { metalness: 0.8, roughness: 0.3 }), desk, 1.6, 0.03, 0.15);
  pen.rotation.set(Math.PI / 2, 0, 0.9);

  // ---------- Laptop ----------
  const laptop = new THREE.Group();
  laptop.position.set(0.15, 0, 0.1);
  desk.add(laptop);
  const alu = std(0xc5c8cd, { metalness: 0.9, roughness: 0.32 });
  mesh(geo(new RoundedBoxGeometry(2.8, 0.07, 1.95, 3, 0.03)), alu, laptop, 0, 0.035, 0);

  // Teclas (una sola InstancedMesh: 1 draw call)
  const keyCols = 14;
  const keyRows = 5;
  const keys = new THREE.InstancedMesh(
    geo(new RoundedBoxGeometry(0.138, 0.012, 0.138, 2, 0.02)),
    std(0x1d1e20, { roughness: 0.55 }),
    keyCols * keyRows,
  );
  const m4 = new THREE.Matrix4();
  for (let r = 0; r < keyRows; r++) {
    for (let col = 0; col < keyCols; col++) {
      m4.makeTranslation(-1.0725 + col * 0.165, 0.076, -0.68 + r * 0.165);
      keys.setMatrixAt(r * keyCols + col, m4);
    }
  }
  laptop.add(keys);
  mesh(geo(new RoundedBoxGeometry(0.95, 0.004, 0.55, 2, 0.002)), std(0xb9bcc1, { metalness: 0.6, roughness: 0.25 }), laptop, 0, 0.071, 0.56);

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.07, -0.965);
  laptop.add(hinge);
  mesh(geo(new RoundedBoxGeometry(2.8, 1.85, 0.04, 3, 0.018)), alu, hinge, 0, 0.925, -0.02);
  mesh(geo(new THREE.PlaneGeometry(2.74, 1.79)), std(0x050505, { roughness: 0.2 }), hinge, 0, 0.925, 0.0006);

  // Pantalla: editor de código dibujado en un canvas
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = isMobile ? 1024 : 1536;
  screenCanvas.height = isMobile ? 640 : 960;
  const sctx = screenCanvas.getContext('2d')!;
  const screenTex = track(new THREE.CanvasTexture(screenCanvas));
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = 4;
  const screenMat = track(new THREE.MeshBasicMaterial({ map: screenTex, color: 0x000000, toneMapped: false }));
  const screen = mesh(geo(new THREE.PlaneGeometry(2.6, 1.625)), screenMat, hinge, 0, 0.94, 0.0012);

  const FONT = '"JetBrains Mono", ui-monospace, monospace';
  let lastDrawKey = '';
  const drawScreen = (chars: number, cursorOn: boolean, done: boolean) => {
    const drawKey = `${chars}|${cursorOn}|${done}`;
    if (drawKey === lastDrawKey) return;
    lastDrawKey = drawKey;
    // El editor se diseña en 1024×640 y se escala al tamaño real del canvas
    const W = 1024;
    const H = 640;
    sctx.setTransform(screenCanvas.width / W, 0, 0, screenCanvas.width / W, 0, 0);
    sctx.fillStyle = C.bg;
    sctx.fillRect(0, 0, W, H);
    sctx.fillStyle = C.bar;
    sctx.fillRect(0, 0, W, 44);
    for (let i = 0; i < 3; i++) {
      sctx.fillStyle = '#3a3b3f';
      sctx.beginPath();
      sctx.arc(26 + i * 22, 22, 6, 0, Math.PI * 2);
      sctx.fill();
    }
    sctx.font = `400 19px ${FONT}`;
    sctx.fillStyle = C.muted;
    sctx.fillText('portfolio.ts', 112, 29);

    sctx.font = `400 24px ${FONT}`;
    let remaining = chars;
    let cursorX = 88;
    let cursorY = 92;
    const lineH = 36;
    for (let i = 0; i < CODE.length; i++) {
      const y = 92 + i * lineH;
      sctx.fillStyle = '#34363b';
      sctx.fillText(String(i + 1).padStart(2, ' '), 24, y);
      let x = 88;
      for (const [text, color] of CODE[i]) {
        if (remaining <= 0) break;
        const part = text.slice(0, remaining);
        sctx.fillStyle = color;
        sctx.fillText(part, x, y);
        x += sctx.measureText(part).width;
        remaining -= part.length;
      }
      if (remaining > 0 || i === 0) {
        cursorX = x;
        cursorY = y;
      }
      remaining -= 1;
      if (remaining < 0) break;
    }
    if (cursorOn && !done) {
      sctx.fillStyle = C.text;
      sctx.fillRect(cursorX + 2, cursorY - 20, 2, 26);
    }
    sctx.fillStyle = C.bar;
    sctx.fillRect(0, H - 38, W, 38);
    sctx.font = `400 17px ${FONT}`;
    sctx.fillStyle = done ? C.str : C.muted;
    sctx.fillText(done ? '✓ build exitoso   0 errores   60 fps' : 'escribiendo…   TypeScript   UTF-8', 20, H - 13);
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    screenTex.needsUpdate = true;
  };
  /**
   * Vista final: la pantalla 3D muestra el mismo marco (bisel + barra con
   * pestañas) y el inicio de "Sobre mí" que el sitio real, con las mismas
   * medidas (src/scripts/insideLayout.ts). Así, cuando el contenido real
   * aparece encima, no se nota el cambio: seguimos "dentro" de la laptop.
   * fw/fh = fracción de la pantalla visible cuando la cámara está pegada a ella.
   */
  const setSpacing = (v: string) => {
    if ('letterSpacing' in sctx) (sctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = v;
  };
  const wrapLines = (text: string, maxW: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (sctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  };
  const drawInside = (p: number, fw: number, fh: number) => {
    const vw = width;
    const vh = height;
    const drawKey = `inside|${Math.round(p * 20)}|${fw.toFixed(3)}|${fh.toFixed(3)}|${vw}x${vh}`;
    if (drawKey === lastDrawKey) return;
    lastDrawKey = '';
    drawScreen(TOTAL_CHARS, false, true); // de fondo: el editor terminado
    lastDrawKey = drawKey;

    const CW = screenCanvas.width;
    const CH = screenCanvas.height;
    const k = (CW * fw) / vw; // px del canvas por px CSS
    const ox = (CW - CW * fw) / 2;
    const oy = (CH - CH * fh) / 2;
    const B = bezelFor(vw);
    const pad = padFor(vw);
    const narrow = isNarrow(vw);

    sctx.save();
    sctx.globalAlpha = easeOut(p);
    sctx.fillStyle = COLORS.bezel;
    sctx.fillRect(0, 0, CW, CH);
    sctx.setTransform(k, 0, 0, k, ox, oy); // desde aquí se dibuja en px CSS

    // Vidrio de la pantalla
    sctx.fillStyle = COLORS.bg;
    sctx.beginPath();
    sctx.roundRect(B, B, vw - 2 * B, vh - 2 * B, 12);
    sctx.fill();

    // Barra de la ventana
    sctx.fillStyle = COLORS.bar;
    sctx.beginPath();
    sctx.roundRect(B, B, vw - 2 * B, BAR_H, [12, 12, 0, 0]);
    sctx.fill();
    sctx.fillStyle = COLORS.line;
    sctx.fillRect(B, B + BAR_H - 1, vw - 2 * B, 1);
    let x = B + (narrow ? 10 : 16);
    const midY = B + BAR_H / 2;
    if (!narrow) {
      for (let i = 0; i < 3; i++) {
        sctx.fillStyle = COLORS.dot;
        sctx.beginPath();
        sctx.arc(x + 5 + i * 17, midY, 5, 0, Math.PI * 2);
        sctx.fill();
      }
      x += 44 + 18;
    }
    sctx.font = '400 13px Geist, system-ui, sans-serif';
    sctx.textBaseline = 'middle';
    TABS.forEach((tab, i) => {
      const tw = sctx.measureText(tab.label).width + (narrow ? 20 : 24);
      if (i === 0) {
        sctx.fillStyle = '#1a1a1d';
        sctx.beginPath();
        sctx.roundRect(x, midY - 15, tw, 30, 7);
        sctx.fill();
      }
      sctx.fillStyle = i === 0 ? COLORS.text : COLORS.faint;
      sctx.fillText(tab.label, x + (narrow ? 10 : 12), midY + 0.5);
      x += tw + 2;
    });
    sctx.font = '400 12px "Geist Mono", ui-monospace, monospace';
    sctx.textAlign = 'right';
    sctx.fillStyle = '#7fb48c';
    sctx.fillText('60 fps', vw - B - (narrow ? 10 : 16), midY);
    if (!narrow) {
      const fpsW = sctx.measureText('60 fps').width;
      sctx.fillStyle = COLORS.faint;
      sctx.fillText('stephano.dev', vw - B - 16 - fpsW - 14, midY);
    }
    sctx.textAlign = 'left';

    // Inicio de "Sobre mí"
    const left = B + Math.max(0, (vw - 2 * B - CONTENT_MAX) / 2) + pad;
    const eyebrowTop = B + BAR_H + firstSectionTopFor(vw);
    sctx.textBaseline = 'alphabetic';
    sctx.font = '400 12px "Geist Mono", ui-monospace, monospace';
    setSpacing('0.96px');
    sctx.fillStyle = COLORS.faint;
    sctx.fillText(ABOUT_EYEBROW.toUpperCase(), left, eyebrowTop + 12);
    const ts = titleSizeFor(vw);
    sctx.font = `600 ${ts}px Geist, system-ui, sans-serif`;
    setSpacing(`${-0.03 * ts}px`);
    sctx.fillStyle = COLORS.text;
    const maxW = Math.min(ABOUT_TITLE_MAX, vw - 2 * B - 2 * pad);
    const lineH = ts * 1.1;
    wrapLines(ABOUT_TITLE, maxW).forEach((line, i) => {
      sctx.fillText(line, left, eyebrowTop + 32 + i * lineH + ts * 0.86);
    });
    setSpacing('0px');
    sctx.restore();
    screenTex.needsUpdate = true;
  };

  drawScreen(0, false, false);
  document.fonts?.ready.then(() => {
    lastDrawKey = '';
  });

  // ---------- Monito (diseño original, proporciones realistas) ----------
  const monkey = new THREE.Group();
  monkey.position.set(-0.5, 0, 1.98);
  desk.add(monkey);

  const furTex = track(makeFurTexture());
  const fur = phys(0x2e1f15, {
    roughness: 0.95,
    bumpMap: furTex,
    bumpScale: 1.5,
    sheen: 0.5,
    sheenColor: new THREE.Color(0x6b4e38),
    sheenRoughness: 0.7,
  });
  const skin = phys(0xc29a7c, { roughness: 0.65, sheen: 0.3, sheenColor: new THREE.Color(0xe8c4a8) });
  const skinDark = phys(0x9c7860, { roughness: 0.7 });
  const eyeMat = phys(0x24160d, { roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 });
  const lineMat = std(0x3a2418, { roughness: 0.8 });
  const hoodie = phys(0x3a3c40, { roughness: 0.95, sheen: 0.6, sheenColor: new THREE.Color(0x6b6e74) });
  const graphite = std(0x26272a, { roughness: 0.45, metalness: 0.3 });

  // Banquito
  mesh(geo(new THREE.CylinderGeometry(0.4, 0.38, 0.08, 32)), std(0x6b5440, { roughness: 0.6 }), monkey, 0, -0.52, 0);
  mesh(geo(new THREE.CylinderGeometry(0.04, 0.05, 1.1, 12)), legMat, monkey, 0, -1.1, 0);
  mesh(geo(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 24)), legMat, monkey, 0, -1.64, 0);

  // Torso con polerón
  // Un solo volumen torneado: se ve como una prenda, no como bolitas
  const torsoProfile = [
    [0, -0.47], [0.2, -0.45], [0.27, -0.36], [0.29, -0.18], [0.285, 0.02],
    [0.27, 0.2], [0.23, 0.34], [0.15, 0.43], [0.09, 0.47], [0, 0.48],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const chest = mesh(geo(new THREE.LatheGeometry(torsoProfile, 40)), hoodie, monkey, 0, 0.0, 0.02);
  chest.scale.set(1, 1, 0.8);
  const hood = mesh(geo(new THREE.TorusGeometry(0.13, 0.045, 10, 28)), hoodie, monkey, 0, 0.44, 0.08);
  hood.rotation.x = Math.PI / 2.3;
  mesh(geo(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 16)), fur, monkey, 0, 0.52, 0.0);

  // Piernas sentado
  const thighGeo = geo(new THREE.CapsuleGeometry(0.085, 0.36, 4, 12));
  const shinGeo = geo(new THREE.CapsuleGeometry(0.07, 0.32, 4, 12));
  const footGeo = geo(new THREE.SphereGeometry(0.08, 12, 10));
  [-0.15, 0.15].forEach((x) => {
    const thigh = mesh(thighGeo, fur, monkey, x, -0.42, -0.24);
    thigh.rotation.x = Math.PI / 2;
    const shin = mesh(shinGeo, fur, monkey, x, -0.66, -0.47);
    shin.rotation.x = 0.15;
    mesh(footGeo, skinDark, monkey, x, -0.87, -0.53).scale.set(0.9, 0.45, 1.7);
  });

  // Cola larga y delgada
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.38, 0.26),
    new THREE.Vector3(0.05, -0.6, 0.55),
    new THREE.Vector3(0.28, -0.85, 0.7),
    new THREE.Vector3(0.55, -0.7, 0.62),
    new THREE.Vector3(0.62, -0.42, 0.45),
    new THREE.Vector3(0.52, -0.3, 0.32),
  ]);
  mesh(geo(new THREE.TubeGeometry(tailCurve, 48, 0.032, 8)), fur, monkey);

  // Cabeza (la cara mira hacia -z)
  const head = new THREE.Group();
  head.position.set(0, 0.78, -0.02);
  monkey.add(head);
  mesh(geo(new THREE.SphereGeometry(0.25, 32, 24)), fur, head, 0, 0.02, 0.02).scale.set(1, 0.95, 1.05);
  mesh(geo(new THREE.SphereGeometry(0.2, 28, 20)), skin, head, 0, -0.02, -0.15).scale.set(0.95, 1.05, 0.55);
  const brow = mesh(geo(new THREE.CapsuleGeometry(0.032, 0.15, 4, 10)), skinDark, head, 0, 0.065, -0.235);
  brow.rotation.z = Math.PI / 2;
  [-0.062, 0.062].forEach((x) => {
    mesh(geo(new THREE.SphereGeometry(0.038, 12, 10)), skinDark, head, x, 0.022, -0.232).scale.set(1.2, 0.8, 0.6);
    mesh(geo(new THREE.SphereGeometry(0.028, 16, 12)), eyeMat, head, x, 0.022, -0.248);
  });
  mesh(geo(new THREE.SphereGeometry(0.11, 24, 18)), skin, head, 0, -0.1, -0.255).scale.set(1.15, 0.85, 0.95);
  [-0.022, 0.022].forEach((x) => mesh(geo(new THREE.SphereGeometry(0.012, 8, 6)), lineMat, head, x, -0.075, -0.352).scale.set(1, 0.6, 0.6));
  const mouth = mesh(geo(new THREE.TorusGeometry(0.045, 0.006, 6, 16, Math.PI * 0.8)), lineMat, head, 0, -0.125, -0.345);
  mouth.rotation.z = Math.PI * 1.1;
  mesh(geo(new THREE.SphereGeometry(0.06, 14, 10)), skin, head, 0, -0.18, -0.27).scale.set(1.1, 0.7, 0.9);
  [-1, 1].forEach((s) => {
    mesh(geo(new THREE.SphereGeometry(0.085, 16, 12)), skin, head, s * 0.245, 0.0, -0.02).scale.set(0.35, 1, 0.9);
    mesh(geo(new THREE.SphereGeometry(0.06, 12, 10)), skinDark, head, s * 0.255, 0.0, -0.025).scale.set(0.25, 0.9, 0.75);
  });

  // Audífonos
  mesh(geo(new THREE.TorusGeometry(0.285, 0.016, 8, 40, Math.PI)), graphite, head, 0, 0.03, 0.03);
  const cushionMat = std(0x17181a, { roughness: 0.9 });
  [-1, 1].forEach((s) => {
    const cup = mesh(geo(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 28)), graphite, head, s * 0.29, 0.02, 0.03);
    cup.rotation.z = Math.PI / 2;
    const cushion = mesh(geo(new THREE.TorusGeometry(0.068, 0.02, 8, 24)), cushionMat, head, s * 0.262, 0.02, 0.03);
    cushion.rotation.y = Math.PI / 2;
  });

  // Brazos y manos con dedos
  const armGeo = geo(new THREE.CylinderGeometry(1, 1, 1, 12));
  const jointGeo = geo(new THREE.SphereGeometry(1, 12, 10));
  const palmGeo = geo(new THREE.SphereGeometry(0.06, 14, 10));
  const fingerGeo = geo(new THREE.CapsuleGeometry(0.016, 0.06, 3, 8));
  type Arm = {
    upper: THREE.Mesh;
    fore: THREE.Mesh;
    shoulderJ: THREE.Mesh;
    elbowJ: THREE.Mesh;
    hand: THREE.Group;
    fingers: THREE.Group[];
  };
  const makeArm = (): Arm => {
    const upper = new THREE.Mesh(armGeo, hoodie);
    const fore = new THREE.Mesh(armGeo, fur);
    const shoulderJ = new THREE.Mesh(jointGeo, hoodie);
    shoulderJ.scale.setScalar(0.095);
    const elbowJ = new THREE.Mesh(jointGeo, hoodie);
    elbowJ.scale.setScalar(0.08);
    const hand = new THREE.Group();
    const palm = new THREE.Mesh(palmGeo, skinDark);
    palm.scale.set(1, 0.5, 1.1);
    hand.add(palm);
    const fingers: THREE.Group[] = [];
    for (let f = 0; f < 4; f++) {
      const pivot = new THREE.Group();
      pivot.position.set(-0.039 + f * 0.026, -0.005, -0.055);
      const finger = new THREE.Mesh(fingerGeo, skinDark);
      finger.position.set(0, -0.012, -0.035);
      finger.rotation.x = -Math.PI / 2 + 0.6;
      pivot.add(finger);
      hand.add(pivot);
      fingers.push(pivot);
    }
    const thumb = new THREE.Mesh(fingerGeo, skinDark);
    thumb.position.set(0.06, -0.01, -0.02);
    thumb.rotation.set(-Math.PI / 2 + 0.3, 0, -0.9);
    hand.add(thumb);
    desk.add(upper, fore, shoulderJ, elbowJ, hand);
    return { upper, fore, shoulderJ, elbowJ, hand, fingers };
  };
  const arms = [makeArm(), makeArm()];
  const shoulderLocal = [new THREE.Vector3(-0.25, 0.3, 0), new THREE.Vector3(0.25, 0.3, 0)];
  const handOnKeyboard = [new THREE.Vector3(-0.42, 0.1, -0.22), new THREE.Vector3(0.22, 0.1, -0.18)];

  // Orientar al monito hacia el teclado
  const kbCenter = new THREE.Vector3(-0.1, 0, 0.05).add(laptop.position);
  monkey.lookAt(kbCenter.x, 0, kbCenter.z);
  monkey.rotateY(Math.PI);

  // Sombras
  if (useShadows) {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o !== deskTop) o.castShadow = true;
    });
  }

  const UP = new THREE.Vector3(0, 1, 0);
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const elbowPos = new THREE.Vector3();
  const placeLimb = (m: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3, radius: number) => {
    tmpC.subVectors(to, from);
    const len = tmpC.length();
    m.position.copy(from).addScaledVector(tmpC, 0.5);
    m.scale.set(radius, len, radius);
    m.quaternion.setFromUnitVectors(UP, tmpC.normalize());
  };

  // ---------- Partículas de polvo (ambiente sutil) ----------
  const dustCount = isMobile ? 60 : 140;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 9;
    dustPos[i * 3 + 1] = Math.random() * 4;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 7;
  }
  const dustGeo = geo(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = track(
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.35, depthWrite: false }),
  );
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ---------- Cámara ----------
  const camStartFar = new THREE.Vector3(5.4, 3.7, 8.6);
  const camStart = new THREE.Vector3(3.9, 2.7, 6.3);
  const lookStart = new THREE.Vector3(-0.2, 0.45, 0.4);
  if (isMobile) {
    camStartFar.multiplyScalar(1.25);
    camStart.multiplyScalar(1.3);
    lookStart.x += 0.45;
  }
  const screenCenter = new THREE.Vector3();
  const screenNormal = new THREE.Vector3();
  const camEnd = new THREE.Vector3();
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const headTarget = new THREE.Vector3();
  const headRest = head.quaternion.clone();
  const qTmp = new THREE.Quaternion();

  // ---------- Tamaño ----------
  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvasHost.clientWidth || window.innerWidth;
    height = canvasHost.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvasHost);

  // ---------- Scroll ----------
  const state = { p: reduceMotion ? 0.55 : 0 };
  let tween: gsap.core.Tween | null = null;
  if (!reduceMotion) {
    tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.9 },
    });
  }

  // ---------- Loop ----------
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let time = 0;

  let diving = false;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;
    const t = state.p;

    const a = easeInOut(range(t, 0, 0.28));
    const b = easeInOut(range(t, 0.22, 0.45));
    const typing = range(t, 0.38, 0.64);
    const c = easeInOut(range(t, 0.62, 0.86));
    const term = range(t, 0.8, 0.93); // la pantalla se vuelve la sección About
    const done = typing >= 1;
    // Avisar a la barra de navegación para que no tape la entrada a la pantalla
    if (c > 0.2 !== diving) {
      diving = c > 0.2;
      window.dispatchEvent(new CustomEvent('story-dive', { detail: diving }));
    }

    // 1) Escritorio entra girando
    desk.rotation.y = lerp(-0.95, 0, a);
    desk.position.y = lerp(-0.5, 0, easeOut(range(t, 0, 0.28)));

    // 2) Tapa y pantalla
    hinge.rotation.x = lerp(Math.PI / 2 - 0.015, -0.22, b);
    const on = range(t, 0.33, 0.45);
    screenMat.color.setScalar(on);
    const cursorOn = Math.floor(time * 2) % 2 === 0;
    // Distancia a la que la pantalla llena exactamente el viewport
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const coverDist = Math.min(1.625 / (2 * tanHalf), 2.6 / (2 * tanHalf * camera.aspect)) * 0.97;
    if (term > 0) {
      const visH = 2 * coverDist * tanHalf;
      drawInside(term, (visH * camera.aspect) / 2.6, visH / 1.625);
    } else {
      drawScreen(Math.floor(typing * TOTAL_CHARS), cursorOn && on > 0.5, done);
    }

    screen.getWorldPosition(screenCenter);
    screenNormal.set(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(qTmp));
    screenLight.position.copy(screenCenter).addScaledVector(screenNormal, 0.6);
    screenLight.intensity = on * 3.5;

    // 3) Cámara
    camPos.lerpVectors(camStartFar, camStart, easeOut(range(t, 0, 0.3)));
    camPos.x += Math.sin(time * 0.35) * 0.06;
    camPos.y += Math.sin(time * 0.5) * 0.04;
    lookAt.copy(lookStart);
    if (c > 0) {
      camEnd.copy(screenCenter).addScaledVector(screenNormal, coverDist);
      const p1 = tmpA.set(0.9, 2.1, 3.2);
      const p2 = tmpB.set(0.4, 1.8, 2.0);
      const u = c;
      const iu = 1 - u;
      const k0 = iu * iu * iu;
      const k1 = 3 * iu * iu * u;
      const k2 = 3 * iu * u * u;
      const k3 = u * u * u;
      camPos.set(
        k0 * camPos.x + k1 * p1.x + k2 * p2.x + k3 * camEnd.x,
        k0 * camPos.y + k1 * p1.y + k2 * p2.y + k3 * camEnd.y,
        k0 * camPos.z + k1 * p1.z + k2 * p2.z + k3 * camEnd.z,
      );
      lookAt.lerp(screenCenter, easeOut(c));
    }
    camera.position.copy(camPos);
    camera.lookAt(lookAt);

    // Encuadre: en desktop la escena va a la derecha; en celular sube
    const wide = width / height > 1.1;
    const shift = wide ? 0.25 * (1 - c) : 0;
    const lift = wide ? 0 : 0.16 * (1 - c);
    if (shift > 0.001 || lift > 0.001) camera.setViewOffset(width, height, -width * shift, height * lift, width, height);
    else camera.clearViewOffset();

    // Cabeza: mira a la cámara al inicio, luego a la pantalla
    const lookAtCam = 1 - range(t, 0.28, 0.4);
    headTarget.lerpVectors(screenCenter, camera.position, lookAtCam);
    head.quaternion.copy(headRest);
    head.updateMatrixWorld();
    head.lookAt(headTarget);
    head.rotateY(Math.PI);
    qTmp.copy(head.quaternion);
    head.quaternion.copy(headRest).slerp(qTmp, 0.8);
    const typingActive = on * (done ? 0.2 : 1) * (1 - c);
    head.position.y = 0.78 + Math.sin(time * 1.4) * 0.006 + Math.sin(time * 8) * 0.004 * typingActive;
    head.rotation.z += Math.sin(time * 0.9) * 0.025;
    chest.scale.y = 1 + Math.sin(time * 1.4) * 0.01; // respiración

    // Brazos y dedos tecleando
    desk.updateMatrixWorld();
    for (let i = 0; i < 2; i++) {
      const arm = arms[i];
      const shoulder = monkey.localToWorld(tmpA.copy(shoulderLocal[i]));
      desk.worldToLocal(shoulder);
      const hand = laptop.localToWorld(tmpB.copy(handOnKeyboard[i]));
      desk.worldToLocal(hand);
      hand.y += (1 - b) * 0.08;
      const phase = i * 2.1;
      hand.y += Math.max(0, Math.sin(time * 6 + phase)) * 0.015 * typingActive;
      hand.x += Math.sin(time * 2.3 + phase) * 0.04 * typingActive;
      const e = elbowPos.lerpVectors(shoulder, hand, 0.48);
      e.y -= 0.16;
      e.x += i === 0 ? -0.14 : 0.14;
      placeLimb(arm.upper, shoulder, e, 0.085);
      placeLimb(arm.fore, e, hand, 0.062);
      arm.shoulderJ.position.copy(shoulder);
      arm.elbowJ.position.copy(e);
      arm.hand.position.copy(hand);
      arm.hand.quaternion.copy(monkey.quaternion);
      arm.fingers.forEach((f, j) => {
        const tap = Math.max(0, Math.sin(time * 16 + j * 1.7 + phase));
        f.rotation.x = 0.35 - tap * 0.5 * typingActive;
      });
    }

    // Polvo flotando
    dust.rotation.y = time * 0.01;
    dust.position.y = Math.sin(time * 0.2) * 0.05;
    dustMat.opacity = 0.35 * (1 - c);
    screenLight.intensity *= 1 - term;

    // UI
    captions.forEach((el, i) => {
      const start = [-1, 0.3, 0.58][i] ?? 0;
      const end = [0.28, 0.56, 0.78][i] ?? 1;
      const vis = Math.min(range(t, start, start + 0.06), 1 - range(t, end - 0.06, end));
      el.style.opacity = String(vis);
      el.style.transform = `translateY(${(1 - vis) * 16}px)`;
      el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
    });
    if (progressBar) progressBar.style.transform = `scaleX(${t})`;

    renderer.render(scene, camera);
  };

  const start = () => {
    if (running) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Solo renderiza cuando la sección está en pantalla y la pestaña visible
  let inView = false;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !document.hidden) start();
    else stop();
  });
  io.observe(section);
  const onVisibility = () => {
    if (document.hidden) stop();
    else if (inView) start();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener('load', onLoad);

  frame();
  cancelAnimationFrame(raf);

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('load', onLoad);
    tween?.scrollTrigger?.kill();
    tween?.kill();
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
