'use client';

// The 3D logo creature: built in real time from the logo's own shapes
// (4 extruded rounded-rect wings, beads, pill antennae, squares) and posed through
// 11 life stages driven by scroll. Ported from the Glass prototype.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const NAMES = ['Egg', 'Hatching', 'Larva', 'Inching', 'Hanging', 'Spinning', 'Chrysalis', 'Emerging', 'Drying', 'Unfolding', 'Butterfly'];
const N = NAMES.length;

type Frame = number[]; // [x,y,z, rx,ry,rz (deg), s] in logo units (y down)
type Part = { name: string; obj: THREE.Object3D; mesh: THREE.Mesh };

function progress() {
  const m = document.documentElement.scrollHeight - window.innerHeight;
  return m > 0 ? Math.max(0, Math.min(1, window.scrollY / m)) : 0;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Creature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const stageName = nameRef.current;
    const dots = dotsRef.current ? (Array.from(dotsRef.current.children) as HTMLElement[]) : [];
    const setStage = (idx: number) => {
      if (stageName && stageName.textContent !== NAMES[idx]) {
        stageName.textContent = NAMES[idx];
        dots.forEach((d, k) => d.classList.toggle('on', k <= idx));
      }
    };

    const canvas = canvasRef.current;
    if (!canvas || !hasWebGL()) {
      // No WebGL: static logo, meter still follows scroll.
      setFallback(true);
      const onScroll = () => setStage(Math.min(N - 1, Math.floor(progress() * N)));
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reduceMq.matches;
    const onReduce = () => {
      reduce = reduceMq.matches;
    };
    reduceMq.addEventListener('change', onReduce);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      setFallback(true);
      reduceMq.removeEventListener('change', onReduce);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 12);
    // Intensities scaled by PI to match the prototype's r128 (legacy lighting) look.
    const PI = Math.PI;
    scene.add(new THREE.AmbientLight(0xffffff, 0.35 * PI));
    const key = new THREE.DirectionalLight(0xffffff, 1.1 * PI);
    key.position.set(3, 5, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfa8ff, 0.8 * PI);
    rim.position.set(-2, 1, -6);
    scene.add(rim);
    const pv = new THREE.PointLight(0x8b5cf6, 1.4 * PI, 30, 0);
    pv.position.set(-5, 2, 4);
    scene.add(pv);
    const pm = new THREE.PointLight(0x2de2c0, 1.1 * PI, 30, 0);
    pm.position.set(5, -3, 4);
    scene.add(pm);

    const U = 1 / 50; // logo unit -> world
    const W = (x: number, y: number) => [(x - 100) * U, -(y - 92) * U];
    type Stop = [number, string];
    // THREE.Color parses hex as sRGB and converts to linear working space (color management is on by default).
    function grad(t: number, stops: Stop[]) {
      t = Math.max(0, Math.min(1, t));
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i], b = stops[i + 1];
        if (t <= b[0]) {
          const f = (t - a[0]) / (b[0] - a[0]);
          return new THREE.Color(a[1]).lerp(new THREE.Color(b[1]), f);
        }
      }
      return new THREE.Color(stops[stops.length - 1][1]);
    }
    const WING: Stop[] = [[0, '#7f2bff'], [0.55, '#3f8fdb'], [1, '#00e5b5']];
    const CORE: Stop[] = [[0, '#00e5b5'], [1, '#00add6']];
    function rounded(w: number, h: number, r: number) {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    function slab(wu: number, hu: number, ru: number, depth: number, yTopLogo: number, stops: Stop[]) {
      const g = new THREE.ExtrudeGeometry(rounded(wu * U, hu * U, ru * U), {
        depth, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 5, curveSegments: 12,
      });
      g.translate(0, 0, -depth / 2);
      g.computeVertexNormals();
      const pos = g.attributes.position, cols = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const ly = pos.getY(i) / U;
        const logoY = yTopLogo + hu / 2 - ly;
        const c = grad(logoY / 184, stops);
        cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
      }
      g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      return g;
    }
    function mat(color?: THREE.Color) {
      return new THREE.MeshPhysicalMaterial({
        vertexColors: !color, color: color || 0xffffff, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.06,
        emissive: new THREE.Color('#1b0b3a'), emissiveIntensity: 0.25, transparent: true,
      });
    }

    const root = new THREE.Group();
    scene.add(root);
    // wings: pivot group at hinge, mesh offset outward
    function wing(name: string, _x0: number, y0: number, w: number, h: number, side: number): Part {
      const piv = new THREE.Group(), m = new THREE.Mesh(slab(w, h, 10, 0.09, y0, WING), mat());
      m.position.x = side * (w / 2) * U;
      piv.add(m);
      root.add(piv);
      return { name, obj: piv, mesh: m };
    }
    const TL = wing('TL', 3, 0, 73, 106, -1), TR = wing('TR', 124, 0, 73, 106, 1), BL = wing('BL', 21, 115, 55, 65, -1), BR = wing('BR', 124, 115, 55, 65, 1);
    function core(name: string, w: number, h: number, r: number, yTop: number): Part {
      const m = new THREE.Mesh(slab(w, h, r, 0.08, yTop, CORE), mat());
      root.add(m);
      return { name, obj: m, mesh: m };
    }
    const A1 = core('A1', 10, 30, 4.5, 27), A2 = core('A2', 10, 30, 4.5, 27), Q1 = core('Q1', 10, 10, 2.5, 62), Q2 = core('Q2', 10, 10, 2.5, 62);
    function bead(name: string, logoY: number): Part {
      const m = new THREE.Mesh(new THREE.SphereGeometry(11 * U, 40, 28), mat(grad(logoY / 184, [[0, '#00e5b5'], [1, '#00a6d6']])));
      root.add(m);
      return { name, obj: m, mesh: m };
    }
    const C1 = bead('C1', 94), C2 = bead('C2', 127), C3 = bead('C3', 160), E1 = bead('E1', 110), E2 = bead('E2', 120);
    // larva colors run the full brand gradient head-to-tail; they settle to the logo's mint beads as it emerges
    const BEADS = ([[E1, '#7f2bff', '#7f2bff'], [E2, '#6650f2', '#6650f2'], [C1, '#4a78e6', '#00e0b8'], [C2, '#2aa8d6', '#00c8c8'], [C3, '#00e5b5', '#00b4d4']] as [Part, string, string][]).map((b) => ({
      m: b[0].mesh.material as THREE.MeshPhysicalMaterial,
      a: new THREE.Color(b[1]),
      b: new THREE.Color(b[2]),
    }));
    const silkGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]);
    const silkMat = new THREE.LineBasicMaterial({ color: 0xd8ccff, transparent: true, opacity: 0 });
    const silk = new THREE.Line(silkGeo, silkMat);
    root.add(silk);

    // keyframes per stage: [x,y,z, rx,ry,rz (deg), s] in logo units (y down). Wings positioned by hinge.
    const F: Record<string, Frame[]> = {
      TL: [[100, 120, 0, 0, 0, 0, 0], [100, 110, 0, 0, 0, 0, 0], [100, 90, 0, 0, 0, 0, 0], [96, 70, 4, 0, 70, 0, 0.35], [94, 72, 6, 0, 84, 0, 0.62], [76, 58, 4, 0, 62, 8, 0.5], [76, 54, 2, 0, 30, 0, 0.88], [76, 53, 0, 0, 0, 0, 1]],
      TR: [[100, 120, 0, 0, 0, 0, 0], [100, 110, 0, 0, 0, 0, 0], [100, 90, 0, 0, 0, 0, 0], [104, 70, 4, 0, -70, 0, 0.35], [106, 72, 6, 0, -84, 0, 0.62], [124, 58, 4, 0, -62, -8, 0.5], [124, 54, 2, 0, -30, 0, 0.88], [124, 53, 0, 0, 0, 0, 1]],
      BL: [[100, 120, 0, 0, 0, 0, 0], [100, 110, 0, 0, 0, 0, 0], [100, 100, 0, 0, 0, 0, 0], [96, 112, 4, 0, 72, 0, 0.35], [94, 118, 6, 0, 86, 0, 0.62], [76, 140, 4, 0, 64, -6, 0.5], [76, 146, 2, 0, 32, 0, 0.9], [76, 147.5, 0, 0, 0, 0, 1]],
      BR: [[100, 120, 0, 0, 0, 0, 0], [100, 110, 0, 0, 0, 0, 0], [100, 100, 0, 0, 0, 0, 0], [104, 112, 4, 0, -72, 0, 0.35], [106, 118, 6, 0, -86, 0, 0.62], [124, 140, 4, 0, -64, 6, 0.5], [124, 146, 2, 0, -32, 0, 0.9], [124, 147.5, 0, 0, 0, 0, 1]],
      A1: [[142, 84, 0, 0, 0, 24, 0.85], [138, 92, 0, 0, 0, 20, 0.85], [86, 150, 0, 0, 0, 150, 0.8], [97, 46, 0, 0, 0, 0, 0.55], [98, 52, 0, 0, 0, 0, 0.3], [91, 46, 0, 0, 0, -6, 0.8], [91, 42, 0, 0, 0, 0, 1], [91, 42, 0, 0, 0, 0, 1]],
      A2: [[156, 84, 0, 0, 0, -24, 0.85], [152, 92, 0, 0, 0, -20, 0.85], [98, 152, 0, 0, 0, -150, 0.8], [103, 46, 0, 0, 0, 0, 0.55], [102, 52, 0, 0, 0, 0, 0.3], [110, 46, 0, 0, 0, 6, 0.8], [110, 42, 0, 0, 0, 0, 1], [110, 42, 0, 0, 0, 0, 1]],
      Q1: [[58, 138, 0, 0, 0, 0, 0.9], [46, 140, 0, 0, 0, 0, 0.9], [95, 14, 0, 0, 0, 0, 0.8], [98, 26, 0, 0, 0, 0, 0.7], [98, 30, 0, 0, 0, 0, 0.6], [91, 67, 0, 0, 0, 0, 0.8], [91, 67, 0, 0, 0, 0, 1], [91, 67, 0, 0, 0, 0, 1]],
      Q2: [[112, 138, 0, 0, 0, 0, 0.9], [134, 140, 0, 0, 0, 0, 0.9], [105, 14, 0, 0, 0, 0, 0.8], [102, 26, 0, 0, 0, 0, 0.7], [102, 30, 0, 0, 0, 0, 0.6], [110, 67, 0, 0, 0, 0, 0.8], [110, 67, 0, 0, 0, 0, 1], [110, 67, 0, 0, 0, 0, 1]],
      E1: [[30, 122, 0, 0, 0, 0, 1.2], [40, 128, 0, 0, 0, 0, 1.2], [100, 30, 0, 0, 0, 0, 1.1], [100, 52, 0, 0, 0, 0, 0.8], [100, 62, 0, 0, 0, 0, 0.4], [100, 92, 0, 0, 0, 0, 0.01], [100, 92, 0, 0, 0, 0, 0.01], [100, 92, 0, 0, 0, 0, 0.01]],
      E2: [[58, 122, 0, 0, 0, 0, 1.3], [60, 102, 0, 0, 0, 0, 1.3], [100, 56, 0, 0, 0, 0, 1.2], [100, 70, 0, 0, 0, 0, 0.9], [100, 72, 0, 0, 0, 0, 0.5], [100, 110, 0, 0, 0, 0, 0.01], [100, 110, 0, 0, 0, 0, 0.01], [100, 110, 0, 0, 0, 0, 0.01]],
      C1: [[87, 122, 0, 0, 0, 0, 1.35], [84, 90, 0, 0, 0, 0, 1.35], [100, 82, 0, 0, 0, 0, 1.25], [100, 88, 0, 0, 0, 0, 1.05], [100, 82, 0, 0, 0, 0, 0.85], [100, 94, 0, 0, 0, 0, 1], [100, 94, 0, 0, 0, 0, 1], [100, 94, 0, 0, 0, 0, 1]],
      C2: [[116, 122, 0, 0, 0, 0, 1.4], [108, 102, 0, 0, 0, 0, 1.4], [104, 108, 0, 0, 0, 0, 1.3], [100, 108, 0, 0, 0, 0, 1.05], [100, 102, 0, 0, 0, 0, 0.85], [100, 127, 0, 0, 0, 0, 1], [100, 127, 0, 0, 0, 0, 1], [100, 127, 0, 0, 0, 0, 1]],
      C3: [[148, 112, 0, 0, 0, 0, 1.65], [142, 122, 0, 0, 0, 0, 1.6], [92, 132, 0, 0, 0, 0, 1.5], [100, 128, 0, 0, 0, 0, 1.05], [100, 122, 0, 0, 0, 0, 0.85], [100, 160, 0, 0, 0, 0, 1], [100, 160, 0, 0, 0, 0, 1], [100, 160, 0, 0, 0, 0, 1]],
    };
    const Z: Frame = [100, 110, 0, 0, 0, 0, 0];
    const EGG: Record<string, Frame> = { TL: Z, TR: Z, BL: Z, BR: Z, A1: Z, A2: Z, Q1: Z, Q2: Z, E1: [100, 108, 0, 0, 0, 0, 0.01], E2: [100, 108, 0, 0, 0, 0, 0.01], C1: [100, 108, 0, 0, 0, 0, 0.01], C2: [100, 108, 0, 0, 0, 0, 0.01], C3: [100, 104, 0, 0, 0, 0, 2.7] };
    const HATCH: Record<string, Frame> = { TL: Z, TR: Z, BL: Z, BR: Z, A1: [110, 86, 0, 0, 0, 18, 0.5], A2: [120, 86, 0, 0, 0, -18, 0.5], Q1: Z, Q2: Z, E1: [68, 120, 0, 0, 0, 0, 0.9], E2: [80, 114, 0, 0, 0, 0, 1], C1: [92, 118, 0, 0, 0, 0, 1.1], C2: [103, 112, 0, 0, 0, 0, 1.2], C3: [115, 108, 0, 0, 0, 0, 1.6] };
    const DRY: Record<string, Frame> = { TL: [76, 56, 3, 0, 48, 14, 0.68], TR: [124, 56, 3, 0, -48, -14, 0.68], BL: [76, 144, 3, 0, 50, -10, 0.68], BR: [124, 144, 3, 0, -50, 10, 0.68], A1: [91, 44, 0, 0, 0, -4, 0.9], A2: [110, 44, 0, 0, 0, 4, 0.9], Q1: [91, 67, 0, 0, 0, 0, 0.9], Q2: [110, 67, 0, 0, 0, 0, 0.9], E1: [100, 92, 0, 0, 0, 0, 0.01], E2: [100, 110, 0, 0, 0, 0, 0.01], C1: [100, 94, 0, 0, 0, 0, 1], C2: [100, 127, 0, 0, 0, 0, 1], C3: [100, 160, 0, 0, 0, 0, 1] };
    Object.keys(F).forEach((k) => {
      F[k].splice(0, 0, EGG[k], HATCH[k]);
      F[k].splice(8, 0, DRY[k]);
    });
    const all = [TL, TR, BL, BR, A1, A2, Q1, Q2, E1, E2, C1, C2, C3];
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const D = Math.PI / 180;

    function pose(st: number, t: number) {
      const i = Math.min(N - 2, Math.floor(st)), f = ease(Math.max(0, Math.min(1, st - i)));
      const larva = st < 4 ? Math.max(0, 1 - Math.abs(st - 2.5) / 1.5) : 0, fly = Math.max(0, st - 9);
      all.forEach((p, idx) => {
        const a = F[p.name][i], b = F[p.name][i + 1], v = a.map((x, k) => x + (b[k] - x) * f);
        const w = W(v[0], v[1]);
        const bob = reduce ? 0 : Math.sin(t * 3 - idx * 0.8) * 0.05 * larva;
        let flap = 0;
        if (!reduce && fly > 0 && /^(TL|TR|BL|BR)$/.test(p.name)) {
          flap = Math.sin(t * 2.2) * 16 * fly * (p.name[1] === 'L' ? 1 : -1) * (p.name[0] === 'B' ? 0.8 : 1);
        }
        p.obj.position.set(w[0], w[1] + (/^[CE]/.test(p.name) ? bob : 0), v[2] * U);
        p.obj.rotation.set(v[3] * D, (v[4] + flap) * D, v[5] * D);
        const s = Math.max(0.001, v[6]);
        p.obj.scale.set(s, s, s);
        p.mesh.visible = v[6] > 0.02;
      });
      const ck = Math.max(0, Math.min(1, (st - 6.5) / 2));
      BEADS.forEach((b) => b.m.color.copy(b.a).lerp(b.b, ck));
      // silk thread during hanging..chrysalis
      const silkA = st < 3.5 ? 0 : st < 4 ? (st - 3.5) * 2 : st < 7 ? 1 : st < 7.6 ? 1 - (st - 7) / 0.6 : 0;
      silkMat.opacity = 0.5 * silkA;
      const topY = W(100, -80)[1], anchor = W(100, 14)[1];
      silk.position.set(0, anchor, 0);
      silk.scale.set(1, Math.max(0.001, topY - anchor), 1);
      // whole-body presentation
      const sway = reduce ? 0 : Math.sin(t * 0.6) * 0.18;
      const spin = st > 5 && st < 7.2 ? (reduce ? 0 : Math.sin(t * 0.9) * 0.45) : 0;
      root.rotation.y = -0.35 + sway + spin;
      root.rotation.x = 0.08;
      root.rotation.z = st < 1.2 && !reduce ? Math.sin(t * 2.2) * 0.06 * (1.2 - st) : 0;
      root.position.y = reduce ? 0 : Math.sin(t * 1.1) * 0.06;
    }

    function resize() {
      const r = canvas!.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      const s = window.innerWidth > 1100 ? 0.5 : 0.4;
      root.scale.set(s, s, s);
    }
    window.addEventListener('resize', resize);
    resize();

    let sm = progress();
    let raf = 0;
    function frame(now: number) {
      const p = progress();
      sm += (p - sm) * 0.1;
      const raw = sm * (N - 1), i = Math.floor(raw), fr = raw - i;
      const st = Math.min(N - 1, i + Math.max(0, Math.min(1, (fr - 0.15) / 0.7)));
      pose(st, now / 1000);
      setStage(Math.min(N - 1, Math.round(st)));
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      reduceMq.removeEventListener('change', onReduce);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      });
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="fallback" src="/logos/caterpillar-logo.png" alt="" />
      ) : (
        <canvas ref={canvasRef} className="stage3d" aria-hidden="true" />
      )}
      <div className="meter" aria-hidden="true">
        <span className="stage-name" ref={nameRef}>
          Egg
        </span>
        <span className="dots" ref={dotsRef}>
          {NAMES.map((n, k) => (
            <i key={n} className={k === 0 ? 'on' : undefined} />
          ))}
        </span>
      </div>
    </>
  );
}
