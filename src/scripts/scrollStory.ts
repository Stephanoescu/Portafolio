import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Escena 3D controlada por scroll:
 *  1. El escritorio gira y entra a escena; el monito saluda mirando a la cámara.
 *  2. Se abre la laptop y el monito empieza a programar (el código se escribe con el scroll).
 *  3. La cámara pasa sobre el hombro del monito y entra a la pantalla.
 */

export interface ScrollStoryOptions {
  section: HTMLElement;
  canvasHost: HTMLElement;
  captions?: HTMLElement[];
  progressBar?: HTMLElement | null;
  fadeOverlay?: HTMLElement | null;
}

type Segment = [string, string];

const C = {
  bg: '#0d1117',
  text: '#E5E7EB',
  muted: '#6B7280',
  blue: '#60A5FA',
  green: '#34D399',
  purple: '#C4B5FD',
  amber: '#FBBF24',
};

const CODE: Segment[][] = [
  [['// stephano.dev  —  scroll para compilar', C.muted]],
  [['const ', C.purple], ['stephano', C.blue], [' = {', C.text]],
  [['  role: ', C.text], ['"Software Engineer"', C.green], [',', C.text]],
  [['  frontend: [', C.text], ['"React"', C.green], [', ', C.text], ['"Angular"', C.green], [', ', C.text], ['"Vue"', C.green], ['],', C.text]],
  [['  backend: [', C.text], ['"Node"', C.green], [', ', C.text], ['"C#"', C.green], [', ', C.text], ['"SQL"', C.green], ['],', C.text]],
  [['  obsession: ', C.text], ['60', C.amber], [', ', C.text], ['// FPS', C.muted]],
  [['};', C.text]],
  [['', C.text]],
  [['function ', C.purple], ['build', C.blue], ['(idea) {', C.text]],
  [['  return ', C.purple], ['optimize', C.blue], ['(', C.text], ['clean', C.blue], ['(', C.text], ['code', C.blue], ['(idea)));', C.text]],
  [['}', C.text]],
  [['', C.text]],
  [['build', C.blue], ['(', C.text], ['"tu próximo proyecto"', C.green], [');', C.text]],
];
const TOTAL_CHARS = CODE.reduce((n, line) => n + line.reduce((m, [s]) => m + s.length, 0) + 1, 0);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function initScrollStory(opts: ScrollStoryOptions): () => void {
  const { section, canvasHost, captions = [], progressBar, fadeOverlay } = opts;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  // ---------- Renderer ----------
  const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 50 : 38, 1, 0.05, 60);

  // ---------- Luces ----------
  scene.add(new THREE.HemisphereLight(0xbfd7ff, 0x0a0a0a, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3b82f6, 3);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const screenLight = new THREE.PointLight(0x60a5fa, 0, 6, 2);
  scene.add(screenLight);

  // ---------- Helpers ----------
  const disposables: { dispose: () => void }[] = [];
  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1, ...extra });
    disposables.push(m);
    return m;
  };
  const geo = <T extends THREE.BufferGeometry>(g: T) => {
    disposables.push(g);
    return g;
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };

  // ---------- Escritorio ----------
  const desk = new THREE.Group();
  scene.add(desk);

  const deskTop = mesh(geo(new THREE.BoxGeometry(5.4, 0.16, 3.4)), mat(0x161618, { roughness: 0.8 }), desk, 0, -0.08, 0);
  const deskEdges = new THREE.LineSegments(
    geo(new THREE.EdgesGeometry(deskTop.geometry)),
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 }),
  );
  disposables.push(deskEdges.material as THREE.Material);
  deskEdges.position.copy(deskTop.position);
  desk.add(deskEdges);

  // Taza de café
  const mugMat = mat(0xf5f5f5, { roughness: 0.4 });
  const mug = new THREE.Group();
  mug.position.set(1.95, 0, 0.9);
  desk.add(mug);
  mesh(geo(new THREE.CylinderGeometry(0.17, 0.15, 0.36, 24)), mugMat, mug, 0, 0.18, 0);
  const handle = mesh(geo(new THREE.TorusGeometry(0.1, 0.03, 8, 16)), mugMat, mug, 0.18, 0.2, 0);
  handle.rotation.y = Math.PI / 2;
  mesh(geo(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 24)), mat(0x3b2416), mug, 0, 0.33, 0);

  // Plantita
  const pot = new THREE.Group();
  pot.position.set(-2.1, 0, -0.9);
  desk.add(pot);
  mesh(geo(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16)), mat(0x9a3412), pot, 0, 0.15, 0);
  const leafMat = mat(0x10b981, { roughness: 0.5 });
  const leafGeo = geo(new THREE.SphereGeometry(0.14, 12, 10));
  [[0, 0.42, 0], [0.1, 0.55, 0.05], [-0.09, 0.5, -0.04], [0.02, 0.66, -0.02]].forEach(([x, y, z]) => {
    const l = mesh(leafGeo, leafMat, pot, x, y, z);
    l.scale.set(1, 1.3, 1);
  });

  // ---------- Laptop ----------
  const laptop = new THREE.Group();
  laptop.position.set(0.15, 0, 0.1);
  desk.add(laptop);
  const shell = mat(0x9ca3af, { metalness: 0.65, roughness: 0.35 });
  mesh(geo(new THREE.BoxGeometry(2.8, 0.1, 2)), shell, laptop, 0, 0.05, 0);
  const keyboard = mesh(geo(new THREE.BoxGeometry(2.4, 0.012, 1.05)), mat(0x1f2937), laptop, 0, 0.105, -0.22);
  keyboard.name = 'keyboard';
  mesh(geo(new THREE.BoxGeometry(0.9, 0.006, 0.5)), mat(0x4b5563), laptop, 0, 0.103, 0.62);

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.1, -1);
  laptop.add(hinge);
  mesh(geo(new THREE.BoxGeometry(2.8, 1.85, 0.07)), shell, hinge, 0, 0.925, -0.035);

  // Textura de la pantalla (editor de código)
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 640;
  const sctx = screenCanvas.getContext('2d')!;
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = 4;
  disposables.push(screenTex);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, color: 0x000000 });
  disposables.push(screenMat);
  const screen = mesh(geo(new THREE.PlaneGeometry(2.62, 1.64)), screenMat, hinge, 0, 0.925, 0.002);

  let lastDrawKey = '';
  const drawScreen = (chars: number, cursorOn: boolean, done: boolean) => {
    const drawKey = `${chars}|${cursorOn}|${done}`;
    if (drawKey === lastDrawKey) return;
    lastDrawKey = drawKey;
    const W = screenCanvas.width;
    const H = screenCanvas.height;
    sctx.fillStyle = C.bg;
    sctx.fillRect(0, 0, W, H);
    // Barra superior
    sctx.fillStyle = '#161b22';
    sctx.fillRect(0, 0, W, 46);
    ['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
      sctx.fillStyle = c;
      sctx.beginPath();
      sctx.arc(28 + i * 26, 23, 8, 0, Math.PI * 2);
      sctx.fill();
    });
    sctx.font = '500 20px "JetBrains Mono", monospace';
    sctx.fillStyle = C.muted;
    sctx.fillText('portfolio.ts', 120, 30);

    sctx.font = '500 25px "JetBrains Mono", monospace';
    let remaining = chars;
    let cursorX = 92;
    let cursorY = 92;
    const lineH = 37;
    for (let i = 0; i < CODE.length; i++) {
      const y = 92 + i * lineH;
      sctx.fillStyle = '#374151';
      sctx.fillText(String(i + 1).padStart(2, ' '), 26, y);
      let x = 92;
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
      remaining -= 1; // salto de línea
      if (remaining < 0) break;
    }
    if (cursorOn && !done) {
      sctx.fillStyle = C.blue;
      sctx.fillRect(cursorX + 2, cursorY - 22, 13, 28);
    }
    // Barra de estado
    sctx.fillStyle = done ? '#065f46' : '#1e3a8a';
    sctx.fillRect(0, H - 40, W, 40);
    sctx.font = '500 19px "JetBrains Mono", monospace';
    sctx.fillStyle = '#ffffff';
    sctx.fillText(done ? '✓ build exitoso  ·  0 errores  ·  60 FPS' : '● escribiendo…  TypeScript  ·  UTF-8', 18, H - 14);
    screenTex.needsUpdate = true;
  };
  drawScreen(0, false, false);
  document.fonts?.ready.then(() => {
    lastDrawKey = '';
  });

  // ---------- Monito ----------
  const monkey = new THREE.Group();
  monkey.position.set(-0.55, 0, 2.2);
  desk.add(monkey);

  const fur = mat(0x6b4226, { roughness: 0.9 });
  const skin = mat(0xe3b98f, { roughness: 0.8 });
  const dark = mat(0x111111, { roughness: 0.4 });
  const white = mat(0xffffff, { roughness: 0.3 });
  const accent = mat(0x3b82f6, { roughness: 0.35, metalness: 0.3 });

  // Banquito
  mesh(geo(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 24)), mat(0x27272a), monkey, 0, -0.55, 0);
  mesh(geo(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 10)), mat(0x3f3f46, { metalness: 0.6 }), monkey, 0, -1.1, 0);

  // Torso (con polo azul)
  const torso = mesh(geo(new THREE.CapsuleGeometry(0.34, 0.42, 6, 16)), accent, monkey, 0, 0.02, 0);
  torso.scale.set(1, 1, 0.85);
  const belly = mesh(geo(new THREE.SphereGeometry(0.26, 16, 12)), mat(0x2563eb, { roughness: 0.4 }), monkey, 0, -0.05, -0.17);
  belly.scale.set(1, 1.1, 0.6);

  // Piernas
  const legGeo = geo(new THREE.CapsuleGeometry(0.11, 0.42, 4, 10));
  [-0.17, 0.17].forEach((x) => {
    const leg = mesh(legGeo, fur, monkey, x, -0.45, -0.3);
    leg.rotation.x = Math.PI / 2.4;
    mesh(geo(new THREE.SphereGeometry(0.12, 10, 8)), skin, monkey, x, -0.68, -0.58).scale.set(1, 0.6, 1.3);
  });

  // Cola
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.4, 0.28),
    new THREE.Vector3(0.1, -0.55, 0.65),
    new THREE.Vector3(0.35, -0.25, 0.85),
    new THREE.Vector3(0.45, 0.15, 0.7),
    new THREE.Vector3(0.3, 0.3, 0.55),
  ]);
  mesh(geo(new THREE.TubeGeometry(tailCurve, 32, 0.045, 8)), fur, monkey);

  // Cabeza
  const head = new THREE.Group();
  head.position.set(0, 0.88, 0);
  monkey.add(head);
  mesh(geo(new THREE.SphereGeometry(0.34, 24, 18)), fur, head);
  const face = mesh(geo(new THREE.SphereGeometry(0.27, 20, 16)), skin, head, 0, -0.05, -0.17);
  face.scale.set(1, 0.95, 0.7);
  const muzzle = mesh(geo(new THREE.SphereGeometry(0.16, 16, 12)), skin, head, 0, -0.13, -0.33);
  muzzle.scale.set(1.2, 0.8, 0.8);
  [-0.045, 0.045].forEach((x) => mesh(geo(new THREE.SphereGeometry(0.018, 8, 6)), dark, head, x, -0.09, -0.455));
  const smile = mesh(geo(new THREE.TorusGeometry(0.06, 0.012, 6, 16, Math.PI)), dark, head, 0, -0.17, -0.44);
  smile.rotation.z = Math.PI;
  // Ojos
  [-0.1, 0.1].forEach((x) => {
    mesh(geo(new THREE.SphereGeometry(0.065, 14, 10)), white, head, x, 0.04, -0.33);
    mesh(geo(new THREE.SphereGeometry(0.035, 10, 8)), dark, head, x, 0.04, -0.385);
    mesh(geo(new THREE.SphereGeometry(0.012, 6, 4)), white, head, x + 0.015, 0.058, -0.413);
  });
  // Orejas
  [-1, 1].forEach((s) => {
    mesh(geo(new THREE.SphereGeometry(0.12, 14, 10)), fur, head, s * 0.34, 0.02, 0).scale.set(0.6, 1, 1);
    mesh(geo(new THREE.SphereGeometry(0.08, 12, 8)), skin, head, s * 0.37, 0.02, -0.01).scale.set(0.4, 1, 1);
  });
  // Audífonos
  mesh(geo(new THREE.TorusGeometry(0.37, 0.03, 8, 32, Math.PI)), mat(0x1f2937, { metalness: 0.5 }), head, 0, 0.02, 0.02);
  [-1, 1].forEach((s) => {
    const cup = mesh(geo(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 20)), accent, head, s * 0.4, 0.02, 0.02);
    cup.rotation.z = Math.PI / 2;
  });

  // Brazos (se recalculan cada frame para que "tecleen")
  const armGeo = geo(new THREE.CylinderGeometry(1, 1, 1, 10));
  const handGeo = geo(new THREE.SphereGeometry(0.085, 12, 10));
  const elbowGeo = geo(new THREE.SphereGeometry(0.075, 10, 8));
  const makeArm = () => {
    const upper = new THREE.Mesh(armGeo, fur);
    const fore = new THREE.Mesh(armGeo, fur);
    const elbow = new THREE.Mesh(elbowGeo, fur);
    const hand = new THREE.Mesh(handGeo, skin);
    hand.scale.set(1.15, 0.7, 1.3);
    desk.add(upper, fore, elbow, hand);
    return { upper, fore, elbow, hand };
  };
  const arms = [makeArm(), makeArm()];
  const shoulderLocal = [new THREE.Vector3(-0.33, 0.33, -0.05), new THREE.Vector3(0.33, 0.33, -0.05)];
  const handOnKeyboard = [new THREE.Vector3(-0.45, 0.14, -0.05), new THREE.Vector3(0.2, 0.14, 0.0)];

  // Orientar al monito hacia el teclado
  const kbCenter = new THREE.Vector3(-0.1, 0, 0.05).add(laptop.position);
  monkey.lookAt(kbCenter.x, 0, kbCenter.z);
  monkey.rotateY(Math.PI); // la cara está hacia -z del grupo

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

  // ---------- Figuras flotantes ----------
  const floaters: THREE.Mesh[] = [];
  const floaterGeos = [
    geo(new THREE.IcosahedronGeometry(0.22, 0)),
    geo(new THREE.TorusGeometry(0.18, 0.06, 10, 24)),
    geo(new THREE.OctahedronGeometry(0.22, 0)),
    geo(new THREE.TorusKnotGeometry(0.13, 0.04, 48, 8)),
  ];
  const floaterMats = [
    mat(0x3b82f6, { roughness: 0.3, metalness: 0.4, emissive: 0x1e3a8a, emissiveIntensity: 0.4 }),
    mat(0x10b981, { roughness: 0.3, metalness: 0.4, emissive: 0x064e3b, emissiveIntensity: 0.4 }),
    mat(0x93c5fd, { wireframe: true }),
  ];
  const floaterCount = isMobile ? 5 : 9;
  for (let i = 0; i < floaterCount; i++) {
    const f = new THREE.Mesh(floaterGeos[i % floaterGeos.length], floaterMats[i % floaterMats.length]);
    f.userData = { a: (i / floaterCount) * Math.PI * 2, r: 3.6 + (i % 3) * 0.55, y: 0.4 + (i % 4) * 0.55, s: 0.6 + (i % 3) * 0.25 };
    scene.add(f);
    floaters.push(f);
  }

  // ---------- Cámara: trayectoria ----------
  const camStartFar = new THREE.Vector3(5.2, 3.6, 8.4);
  const camStart = new THREE.Vector3(3.9, 2.75, 6.3);
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
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
      },
    });
  }

  // ---------- Loop ----------
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let time = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;
    const t = state.p;

    const a = easeInOut(range(t, 0, 0.28));
    const b = easeInOut(range(t, 0.22, 0.45));
    const typing = range(t, 0.4, 0.8);
    const c = easeInOut(range(t, 0.7, 0.98));
    const done = typing >= 1;

    // 1) Escritorio entra girando
    desk.rotation.y = lerp(-0.95, 0, a);
    desk.position.y = lerp(-0.5, 0, easeOut(range(t, 0, 0.28)));

    // 2) Tapa de la laptop
    hinge.rotation.x = lerp(Math.PI / 2 - 0.02, -0.22, b);
    const on = range(t, 0.33, 0.45);
    screenMat.color.setScalar(on);

    // Código escrito por el scroll
    const cursorOn = Math.floor(time * 2.2) % 2 === 0;
    drawScreen(Math.floor(typing * TOTAL_CHARS), cursorOn && on > 0.5, done);

    // Luz de la pantalla
    screen.getWorldPosition(screenCenter);
    screenNormal.set(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(qTmp));
    screenLight.position.copy(screenCenter).addScaledVector(screenNormal, 0.6);
    screenLight.intensity = on * (done ? 7 : 5);
    screenLight.color.set(done ? 0x34d399 : 0x60a5fa);

    // 3) Cámara
    camPos.lerpVectors(camStartFar, camStart, easeOut(range(t, 0, 0.3)));
    camPos.x += Math.sin(time * 0.4) * 0.08;
    camPos.y += Math.sin(time * 0.6) * 0.05;
    lookAt.copy(lookStart);
    if (c > 0) {
      camEnd.copy(screenCenter).addScaledVector(screenNormal, isMobile ? 1.7 : 1.35);
      const p1 = tmpA.set(0.9, 2.0, 3.1);
      const p2 = tmpB.set(0.3, 1.45, 1.3);
      // Bezier cúbica: inicio → sobre el hombro → frente al teclado → pantalla
      const u = c;
      const iu = 1 - u;
      const bx = iu * iu * iu * camPos.x + 3 * iu * iu * u * p1.x + 3 * iu * u * u * p2.x + u * u * u * camEnd.x;
      const by = iu * iu * iu * camPos.y + 3 * iu * iu * u * p1.y + 3 * iu * u * u * p2.y + u * u * u * camEnd.y;
      const bz = iu * iu * iu * camPos.z + 3 * iu * iu * u * p1.z + 3 * iu * u * u * p2.z + u * u * u * camEnd.z;
      camPos.set(bx, by, bz);
      lookAt.lerp(screenCenter, easeOut(c));
    }
    camera.position.copy(camPos);
    camera.lookAt(lookAt);

    // Encuadre: en desktop la escena se corre a la derecha para dejar espacio al texto
    const wide = width / height > 1.1;
    const shift = wide ? 0.25 * (1 - c) : 0;
    const lift = wide ? 0 : 0.16 * (1 - c); // en celular la escena sube para no chocar con el texto
    if (shift > 0.001 || lift > 0.001) camera.setViewOffset(width, height, -width * shift, height * lift, width, height);
    else camera.clearViewOffset();

    // Monito: mira a la cámara al inicio, luego a la pantalla
    const lookAtCam = 1 - range(t, 0.28, 0.4);
    headTarget.lerpVectors(screenCenter, camera.position, lookAtCam);
    head.quaternion.copy(headRest);
    head.updateMatrixWorld();
    head.lookAt(headTarget);
    head.rotateY(Math.PI);
    qTmp.copy(head.quaternion);
    head.quaternion.copy(headRest).slerp(qTmp, 0.85);
    const typingActive = on * (done ? 0.25 : 1) * (1 - c);
    head.position.y = 0.88 + Math.sin(time * 9) * 0.012 * typingActive + Math.sin(time * 1.6) * 0.01;
    head.rotation.z += Math.sin(time * 1.3) * 0.04;

    // Brazos tecleando
    desk.updateMatrixWorld();
    for (let i = 0; i < 2; i++) {
      const arm = arms[i];
      const shoulder = monkey.localToWorld(tmpA.copy(shoulderLocal[i]));
      desk.worldToLocal(shoulder);
      const hand = laptop.localToWorld(tmpB.copy(handOnKeyboard[i]));
      desk.worldToLocal(hand);
      hand.y += (1 - b) * 0.12; // con la tapa cerrada, las manos descansan encima
      const phase = i * Math.PI + i * 0.7;
      hand.y += Math.max(0, Math.sin(time * 17 + phase)) * 0.07 * typingActive;
      hand.x += Math.sin(time * 5 + phase) * 0.05 * typingActive;
      const e = elbowPos.lerpVectors(shoulder, hand, 0.5);
      e.y -= 0.16;
      e.x += i === 0 ? -0.12 : 0.12;
      placeLimb(arm.upper, shoulder, e, 0.075);
      placeLimb(arm.fore, e, hand, 0.068);
      arm.elbow.position.copy(e);
      arm.hand.position.copy(hand);
      arm.hand.quaternion.copy(monkey.quaternion);
    }

    // Figuras flotantes
    floaters.forEach((f, i) => {
      const u = f.userData as { a: number; r: number; y: number; s: number };
      const ang = u.a + time * 0.18 + t * 2.4;
      f.position.set(Math.cos(ang) * u.r, u.y + Math.sin(time * 0.9 + i) * 0.18, Math.sin(ang) * u.r - 0.4);
      f.rotation.x += dt * 0.5;
      f.rotation.y += dt * 0.7;
      f.scale.setScalar(u.s * (1 - c * 0.85));
    });

    // UI: captions, barra de progreso y fundido final
    captions.forEach((el, i) => {
      const start = [-1, 0.32, 0.62][i] ?? 0;
      const end = [0.3, 0.6, 0.82][i] ?? 1;
      const vis = Math.min(range(t, start, start + 0.06), 1 - range(t, end - 0.06, end));
      el.style.opacity = String(vis);
      el.style.transform = `translateY(${(1 - vis) * 24}px)`;
      el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
    });
    if (progressBar) progressBar.style.transform = `scaleX(${t})`;
    if (fadeOverlay) fadeOverlay.style.opacity = String(range(t, 0.88, 1));

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

  // Primer frame aunque aún no esté visible
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
