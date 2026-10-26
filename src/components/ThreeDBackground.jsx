import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------- background
   A warm particle wave field in the spirit of Originkit's "scroll wave
   field": dots filling the lower two thirds of the viewport, rolling into a
   bright ridge band just under the horizon line.

   Four decisions make it read like the reference rather than like a starfield:

   1. Rows are spaced evenly in *depth*, not in screen space. Perspective then
      does the art direction for free: foreground rows sit ~12px apart with
      large dots, while rows at the horizon collapse into a dense 1px dust.
      Even screen-space rows (the obvious approach) throw that gradient away.
   2. The wave is a function of depth, not of screen x. A dot rises by an
      angle that only depends on how far away it is, so rows pile up where the
      rise cancels the plane's descent — that pile-up *is* the ridge line, and
      it is why the horizon band is crisp while the foreground only undulates.
   3. Everything animates from uTime/uScroll on the GPU. Buffers are written
      once, so a frame is one draw call and zero CPU work.
   4. The palette is the site's amber accent extended into a warm family, and
      the canvas is transparent, so the field sits on the page background
      instead of on a hard-coded black plate.
   5. The light theme carries the picture rather than sitting behind it: more
      rows and columns, larger dots, and a narrow screen-space column of extra
      dust through the centre (see BEAM_* below). */

const CAM_Y = 6.5
const CAM_Z = 15
const FOV = 42
const TAN_HALF_FOV = Math.tan((FOV / 2) * (Math.PI / 180))
// Camera pitch, in the exact amount that lands the horizon at ~30% of the
// viewport height. Also used to straighten the rows against the camera.
const PITCH = 8.74 * (Math.PI / 180)

const ROWS = 130
const COLS = 180
const D_NEAR = 9.5
const D_FAR = 320
const AMP = 0.024
const OVERSCAN = 1.06
const DOT_SCALE = 1
const JITTER = 0.006

/* The reference look is gold dust on white, and it is denser and chunkier than
   the dark theme can carry: the light field gets more rows and columns and a
   slightly larger dot scale, which is what turns it from atmosphere on a dark
   page into the picture itself on a paper one. */
const LIGHT_DENSITY = 1.15
const LIGHT_DOT_SCALE = 1.12

/* The vertical stream of dust through the centre of the reference. World x is
   nx * d, so a fixed band of aX lands on a *constant screen-space column* that
   narrows nothing and widens nothing as it falls from the ridge to the bottom
   edge — a beam of the same dust, not a separate visual. */
const BEAM_COLS = 6
const BEAM_WIDTH = 0.056
const BEAM_SIZE_SCALE = 0.85

/* Additive dots stack up quickly, so the dark theme runs much cooler. The
   light theme is the reference look — gold and burnt-orange dust on white —
   so it runs near-opaque with a deeper tail of oranges to hold up on paper. */
const OPACITY = { light: 0.95, dark: 0.5 }
// How much brighter and bigger the centre column is allowed to get.
const BEAM = { light: 0.6, dark: 0.3 }

const PALETTE = {
  light: ['#ffdf7a', '#ffd24d', '#ffc21f', '#ffae00', '#ff9500', '#f97316', '#ea580c', '#ffb24d'],
  dark: ['#ffe9a3', '#ffd76b', '#ffc63d', '#f5ac2b', '#e79a2e', '#ff8f2e', '#ffd9a0', '#c8811f'],
}

function mulberry32(seed) {
  return function random() {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildField(theme, lowQuality) {
  const light = theme === 'light'
  const density = light ? LIGHT_DENSITY : 1
  const dotScale = DOT_SCALE * (light ? LIGHT_DOT_SCALE : 1)
  const rows = Math.round((lowQuality ? ROWS * 0.55 : ROWS) * density)
  const cols = Math.round((lowQuality ? COLS * 0.55 : COLS) * density)
  const count = rows * (cols + BEAM_COLS)
  const random = mulberry32(0x5eed)
  const palette = (PALETTE[theme] ?? PALETTE.dark).map((hex) => new THREE.Color(hex))

  const positions = new Float32Array(count * 3)
  const xs = new Float32Array(count)
  const sizes = new Float32Array(count)
  const jitter = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()
  const depthRatio = D_FAR / D_NEAR
  const columnWidth = (2 * OVERSCAN) / Math.max(cols - 1, 1)

  let i = 0
  /* One writer for every point, grid and beam alike: x and size are decided by
     the caller, the shared per-point randomness (jitter + colour) happens here,
     so both sets are drawn from the same palette with the same bias. */
  const push = (z, x, size) => {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = z

    xs[i] = x
    sizes[i] = size
    jitter[i] = (random() - 0.5) * JITTER

    color
      .copy(palette[(random() * palette.length) | 0])
      .lerp(palette[(random() * palette.length) | 0], random() * 0.6)
      .multiplyScalar(0.9 + random() * 0.16)

    colors[i * 3] = Math.min(color.r, 1)
    colors[i * 3 + 1] = Math.min(color.g, 1)
    colors[i * 3 + 2] = Math.min(color.b, 1)
    i += 1
  }

  for (let r = 0; r < rows; r++) {
    const t = r / Math.max(rows - 1, 1)
    // Geometric spacing keeps rows from collapsing into a single pixel of
    // horizon while still crowding them there.
    const d = D_NEAR * Math.pow(depthRatio, t)
    const z = CAM_Z - d
    // Big sparse dots in the foreground, fine dust at the horizon.
    const rowScale = 3 + (0.5 - 3) * t

    for (let c = 0; c < cols; c++) {
      const x = ((c / Math.max(cols - 1, 1)) - 0.5) * 2 * OVERSCAN + (random() - 0.5) * columnWidth
      const size = rowScale * (0.4 + Math.pow(random(), 2.2) * 1.5) * dotScale
      push(z, x, size)
    }

    // The beam: a handful of extra dots per row, packed around the centre line.
    for (let b = 0; b < BEAM_COLS; b++) {
      const x = (random() - 0.5) * BEAM_WIDTH
      const size = rowScale * (0.35 + Math.pow(random(), 1.8) * 1.1) * dotScale * BEAM_SIZE_SCALE
      push(z, x, size)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aX', new THREE.BufferAttribute(xs, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  // World x only exists inside the shader, so the bounds are generous by hand.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, CAM_Z - D_FAR), D_FAR * 3)
  return geometry
}

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uAmp;
  uniform float uCamZ;
  uniform float uTanHalfFov;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uBeam;

  attribute float aX;
  attribute float aSize;
  attribute float aJitter;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = max(uCamZ - position.z, 6.0);
    float nx = aX * uTanHalfFov * uAspect;
    float worldX = nx * d;

    // Dune ridges running roughly parallel to the horizon, with a slow drift
    // along x so they are never mechanically straight.
    float phase = d * 0.05
                + sin(worldX * 0.016 + uTime * 0.10) * 0.8
                + uTime * 0.22
                + uScroll * 0.0035;

    float w = sin(phase);
    w += sin(phase * 2.35 + 0.7) * 0.34;
    w += sin(phase * 4.90 + 2.1) * 0.12;
    // Fine chop travelling back down the field.
    w += sin(d * 0.7 - uTime * 1.1 + worldX * 0.5) * 0.045;
    w += aJitter;

    // The displacement is angular (d * angle), which is what keeps the ridge
    // structure constant in screen space at every distance.
    vec3 p = vec3(nx * d, d * w * uAmp, position.z);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Central beam: nx is already the dot's normalized screen x, so a narrow
    // gaussian on it lights the centre column without touching the edges.
    float beam = exp(-pow(nx * 26.0, 2.0));
    float lift = 1.0 + beam * uBeam;

    gl_PointSize = clamp(
      aSize * uPixelRatio * (0.5 + lift * 0.5),
      1.0 * uPixelRatio,
      22.0 * uPixelRatio
    );

    vColor = aColor;
    vAlpha = min(uOpacity * lift, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.36, r) * vAlpha);
  }
`

/* The render loop writes uniforms every frame. A plain function keeps those
   writes out of the component body, where they would just be noise. */
function writeSizeUniforms(uniforms, pixelRatio, aspect) {
  uniforms.uPixelRatio.value = pixelRatio
  uniforms.uAspect.value = aspect
}

function writeMotionUniforms(uniforms, time, scroll, amp) {
  uniforms.uTime.value = time
  uniforms.uScroll.value = scroll
  uniforms.uAmp.value = amp
}

function writeTheme(uniforms, theme) {
  uniforms.uOpacity.value = OPACITY[theme] ?? OPACITY.dark
  uniforms.uBeam.value = BEAM[theme] ?? BEAM.dark
}

function Field({ geometry, theme, paused }) {
  const size = useThree((state) => state.size)
  const materialRef = useRef(null)
  const groupRef = useRef(null)
  // Per-frame mutable state, kept in a ref so the render loop never re-renders.
  const live = useRef({ mouseX: 0, mouseY: 0, target: 0, smooth: 0 })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 12.7 },
      uScroll: { value: 0 },
      uAmp: { value: AMP },
      uCamZ: { value: CAM_Z },
      uTanHalfFov: { value: TAN_HALF_FOV },
      uAspect: { value: 1.7 },
      uPixelRatio: { value: 1 },
      // Overwritten by the layout effect below, which runs before the first
      // painted frame — that is what keeps this memo theme-independent.
      uOpacity: { value: OPACITY.dark },
      uBeam: { value: BEAM.dark },
    }),
    [],
  )

  useLayoutEffect(() => {
    const material = materialRef.current
    if (material) writeTheme(material.uniforms, theme)
  }, [theme])

  useEffect(() => {
    if (paused) return undefined
    const state = live.current
    const onScroll = () => {
      state.target = window.scrollY
    }
    const onMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1
      state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [paused])

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return

    writeSizeUniforms(
      material.uniforms,
      state.gl.getPixelRatio(),
      size.width / Math.max(size.height, 1),
    )
    if (paused) return

    const liveState = live.current
    liveState.smooth += (liveState.target - liveState.smooth) * Math.min(1, delta * 6)
    writeMotionUniforms(
      material.uniforms,
      state.clock.elapsedTime,
      liveState.smooth,
      // Scrolling stirs the field up rather than just sliding it past.
      AMP * (1 + Math.min(liveState.smooth / 900, 1) * 0.9),
    )

    // Translating the field against a fixed camera gives the same depth-
    // dependent parallax a camera move would, without touching the camera.
    const group = groupRef.current
    if (group) {
      const step = Math.min(1, delta * 3)
      group.position.x += (liveState.mouseX * -1.7 - group.position.x) * step
      group.position.y += (liveState.mouseY * -0.5 - group.position.y) * step
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          key={theme}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  )
}

export function ThreeDBackground({ theme = 'dark' }) {
  const wrapRef = useRef(null)
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [active, setActive] = useState(
    () =>
      typeof window === 'undefined' ||
      (window.scrollY < window.innerHeight * 1.05 && !document.hidden),
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const geometry = useMemo(() => buildField(theme, reduced), [theme, reduced])

  useEffect(() => () => geometry.dispose(), [geometry])

  /* The field belongs to the hero. Past the first viewport it dissolves — a
     full-viewport dot field behind running body copy would cost far more
     legibility than it adds, and there is no reason to animate it offscreen. */
  useEffect(() => {
    const wrap = wrapRef.current
    const opacityFor = (y, vh) => 1 - Math.min(Math.max(y / (vh * 0.85), 0), 1)

    const apply = () => {
      const vh = window.innerHeight || 1
      const y = window.scrollY
      if (wrap) wrap.style.opacity = String(opacityFor(y, vh))
      setActive(y < vh * 1.05 && !document.hidden)
    }

    // Paint the right opacity for the current scroll position up front so a
    // reload part-way down the page never flashes a full-viewport field.
    if (wrap) wrap.style.opacity = String(opacityFor(window.scrollY, window.innerHeight || 1))

    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply)
    document.addEventListener('visibilitychange', apply)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
      document.removeEventListener('visibilitychange', apply)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-2] pointer-events-none transition-opacity duration-200"
    >
      <Canvas
        // Narrow screens stack the copy over the field, so the dots are
        // dimmed there. Nested opacity multiplies with the scroll fade above.
        className="max-sm:opacity-70"
        dpr={[1, 1.75]}
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, CAM_Y, CAM_Z]}
          rotation={[-PITCH, 0, 0]}
          fov={FOV}
          far={2000}
        />
        <Field geometry={geometry} theme={theme} paused={reduced} />
      </Canvas>
    </div>
  )
}
