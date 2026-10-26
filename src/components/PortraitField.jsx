import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import portraitUrl from '../assets/portrait.jpg'

/* Particle portrait, in the reference's style: the photograph stays visible
   underneath at low opacity and a WebGL dot field is laid exactly on top of
   it. Bright cells become large warm dots, dark cells are dropped, and the
   warmest ones drift so the lit edge reads as a signal dispersing.

   Holding the photo underneath is the whole trick — a pure particle field
   stops looking like the person. The grid below is therefore mapped with the
   same cover-fit maths the <img> uses, so dots and photo stay registered at
   every size instead of ghosting apart. */

/** Matches `object-position: 50% 12%` on the photo underneath. */
const FOCUS = { x: 0.5, y: 0.12 }

/** How much of the real photograph shows through the dots. */
const PHOTO_OPACITY = 0.38

/* The canvas is grown past the photo plate by this fraction on every side,
   purely so the scroll dispersal has somewhere to travel: dots are clipped
   at the canvas edge, and without the margin the spread ends on a hard
   rectangle. The photo keeps its own size — see fitFor(). */
const CANVAS_PAD = 0.3

const VERTEX = /* glsl */ `
  uniform vec2 uRes;      // holder size, CSS px
  uniform vec2 uOffset;   // cover-fit origin, CSS px
  uniform vec2 uDraw;     // cover-fit drawn size, CSS px
  uniform float uCellPx;  // one sampled cell, CSS px
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec2 uMouse;
  uniform float uScroll;  // 0 in place, 1 fully dispersed
  uniform vec2 uPlateOrigin;
  uniform vec2 uPlateSize;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aRand;
  attribute float aWarm;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // position.xy is the cell's place in the IMAGE (0..1), so the cover-fit
    // transform below is the only thing that has to change on resize.
    vec2 px = uOffset + position.xy * uDraw;
    vec2 p = vec2(px.x - uRes.x * 0.5, uRes.y * 0.5 - px.y);

    /* The plate's edge mask, applied per dot. The canvas draws ABOVE that
       mask (so the scroll dispersal is not wiped by it), which means the
       dots have to reproduce its feather themselves — otherwise the dotted
       figure spills past where the photograph has already faded out and
       reads as a larger image. Keep these stops in step with the gradient
       in Hero.jsx. */
    vec2 q = (px - uPlateOrigin) / uPlateSize;
    vec2 rv = (q - vec2(0.5, 0.42)) / vec2(0.62, 0.58);
    float edge = 1.0 - smoothstep(0.58, 1.0, length(rv));
    edge *= 1.0 - smoothstep(0.52, 0.88, q.y);
    // Released once the dispersal is underway, so dots can travel outward.
    edge = mix(edge, 1.0, smoothstep(0.0, 0.35, uScroll));

    // A slow breath across the field — the reference barely moves.
    p.x += sin(uTime * 0.6 + aRand * 6.2831) * 0.9;
    p.y += cos(uTime * 0.5 + aRand * 6.2831) * 0.9;

    // The warmest dots stream up and to the right and thin as they go.
    float drift = aWarm * (0.5 + 0.5 * sin(uTime * 0.35 + aRand * 6.2831));
    p.x += drift * aRand * 26.0;
    p.y += drift * aRand * 16.0;

    p += uMouse * (0.6 + aRand * 1.4) * 6.0;

    /* Scroll dispersal: the portrait spreads apart as the hero leaves. Dots
       push outward from the centre of the plate by a mostly RANDOM distance,
       so the field comes apart unevenly instead of simply scaling up — and
       the squared curve keeps it still until the scroll is clearly underway. */
    float s = uScroll * uScroll;
    vec2 dir = normalize(p + vec2(0.0001, 0.0001));
    p += dir * s * (30.0 + aRand * 260.0);
    p.y += s * (aRand - 0.5) * 140.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = clamp(aSize * uCellPx * uPixelRatio * (1.0 + s * 0.6), 1.0, 26.0);

    vColor = aColor;
    // Thins out early, so the spread never settles as noise over the copy
    // below the plate — it is gone well before the hero leaves.
    float fade = 1.0 - smoothstep(0.08, 0.72, uScroll);
    vAlpha = aSize > 0.001 ? uOpacity * (1.0 - 0.55 * drift) * fade * edge : 0.0;
  }
`

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.0) discard;
    // Round dots with a soft edge, not squares.
    vec2 uv = gl_PointCoord - 0.5;
    float mask = smoothstep(0.5, 0.32, length(uv));
    if (mask <= 0.01) discard;
    gl_FragColor = vec4(vColor, mask * vAlpha);
  }
`

/** The same geometry CSS `object-fit: cover` computes, in CSS pixels. */
function coverFit(boxW, boxH, imgW, imgH) {
  const scale = Math.max(boxW / imgW, boxH / imgH)
  const drawW = imgW * scale
  const drawH = imgH * scale
  return {
    offsetX: (boxW - drawW) * FOCUS.x,
    offsetY: (boxH - drawH) * FOCUS.y,
    drawW,
    drawH,
  }
}

/* Cover-fit for the PLATE, expressed in the padded canvas's coordinates.
   The canvas is larger than the plate, so the photo's rect is centred inside
   it — that recentring is the only difference from coverFit() itself, and it
   is what keeps the dots sitting on the <img> rather than on the canvas. */
function fitFor(canvasW, canvasH, imgW, imgH) {
  const plateW = canvasW / (1 + 2 * CANVAS_PAD)
  const plateH = canvasH / (1 + 2 * CANVAS_PAD)
  const fit = coverFit(plateW, plateH, imgW, imgH)
  return {
    ...fit,
    offsetX: fit.offsetX + (canvasW - plateW) / 2,
    offsetY: fit.offsetY + (canvasH - plateH) / 2,
    plateW,
    plateH,
    plateX: (canvasW - plateW) / 2,
    plateY: (canvasH - plateH) / 2,
  }
}

/** Samples the whole photograph into a `grid`-wide luminance lattice. */
function sampleImage(img, grid) {
  const W = grid
  const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * grid))
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, W, H)
  return { data: ctx.getImageData(0, 0, W, H).data, W, H }
}

export function PortraitField({ className = '', src = portraitUrl }) {
  const holderRef = useRef(null)
  const photoWrapRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const holder = holderRef.current
    const photoWrap = photoWrapRef.current
    if (!holder) return undefined

    let disposed = false
    let cleanup = () => {}

    const img = new Image()
    // An uploaded portrait comes from Supabase Storage; without CORS mode the
    // canvas is tainted and getImageData throws.
    img.crossOrigin = 'anonymous'
    img.src = src
    img.decoding = 'async'

    img.onload = () => {
      if (disposed) return
      try {
        const width = holder.clientWidth || 600
        const height = holder.clientHeight || 700
        const plate = fitFor(width, height, img.naturalWidth, img.naturalHeight)
        /* A fine halftone screen, as in the reference: dense enough that the
           dots read as a texture over the face rather than as scattered
           speckle. Dot size follows the cell, so density and size stay in
           step — see uCellPx below. Keyed to the PLATE, not the padded
           canvas, so the density does not change with CANVAS_PAD. */
        const grid = plate.plateW < 300 ? 170 : 240
        const sample = sampleImage(img, grid)
        if (!sample) throw new Error('no 2d context')

        const { data, W, H } = sample
        const count = W * H
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const rands = new Float32Array(count)
        const warms = new Float32Array(count)

        const warm = new THREE.Color('#ff8a3c')
        const cool = new THREE.Color('#e8e4dc')
        const c = new THREE.Color()

        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const idx = y * W + x
            const i = idx * 4
            const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255

            // Cell centre, in image space (0..1).
            positions[idx * 3] = (x + 0.5) / W
            positions[idx * 3 + 1] = (y + 0.5) / H
            positions[idx * 3 + 2] = 0
            rands[idx] = Math.random()

            /* Dark tones are dropped rather than drawn small: a point sprite
               cannot render below one pixel, so a dark dot would come out the
               same size as a mid-tone one and flatten the portrait into even
               speckle. Culling is what gives hair, brows and eyes their
               shape — and the photo underneath still fills those cells. */
            if (lum <= 0.2) {
              sizes[idx] = 0
              continue
            }

            /* Stretch the subject's own tonal range back across 0..1, then
               lift the mid-tones: skin sits near 0.5 here, and a steep curve
               left the face reading as a hole between brighter hair and
               shirt. */
            const t = Math.min(1, (lum - 0.2) / 0.8)
            sizes[idx] = Math.pow(t, 0.75) * 1.05 + 0.05

            /* Amber is an edge accent, not a wash: only the top of the tonal
               range turns warm, so it lands on the rim-lit hair and shoulder
               the way the reference does and leaves the face neutral. */
            const w = Math.min(1, Math.max(0, (t - 0.86) * 5.0))
            warms[idx] = w
            c.copy(cool).lerp(warm, w)
            colors[idx * 3] = c.r
            colors[idx * 3 + 1] = c.g
            colors[idx * 3 + 2] = c.b
          }
        }

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(width, height)
        renderer.setClearColor(0x000000, 0)
        holder.appendChild(renderer.domElement)
        Object.assign(renderer.domElement.style, {
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          display: 'block',
          /* Above the plate's edge mask, so dispersing dots are not wiped by
             it. The photograph stays below the mask and keeps its feather. */
          zIndex: '2',
        })

        const scene = new THREE.Scene()
        // Orthographic in CSS-pixel space: dots land exactly where the
        // cover-fit maths puts them, which is what keeps them on the photo.
        const camera = new THREE.OrthographicCamera(
          -width / 2,
          width / 2,
          height / 2,
          -height / 2,
          -100,
          100,
        )
        camera.position.z = 10

        const fit = plate

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))
        geometry.setAttribute('aWarm', new THREE.BufferAttribute(warms, 1))

        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          uniforms: {
            uRes: { value: new THREE.Vector2(width, height) },
            uOffset: { value: new THREE.Vector2(fit.offsetX, fit.offsetY) },
            uDraw: { value: new THREE.Vector2(fit.drawW, fit.drawH) },
            uCellPx: { value: fit.drawW / W },
            uPixelRatio: { value: renderer.getPixelRatio() },
            uTime: { value: 0 },
            uOpacity: { value: 0.92 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uScroll: { value: 0 },
            uPlateOrigin: { value: new THREE.Vector2(fit.plateX, fit.plateY) },
            uPlateSize: { value: new THREE.Vector2(fit.plateW, fit.plateH) },
          },
          transparent: true,
          depthWrite: false,
          /* Normal, not additive: additive let overlapping dots pile into a
             single bright mass and erased the face. */
          blending: THREE.NormalBlending,
        })

        scene.add(new THREE.Points(geometry, material))

        const mouseTarget = new THREE.Vector2()
        const onPointer = (e) => {
          const r = holder.getBoundingClientRect()
          mouseTarget.set(
            ((e.clientX - r.left) / r.width - 0.5) * 2,
            -((e.clientY - r.top) / r.height - 0.5) * 2,
          )
        }

        /* Scroll progress for the dispersal: 0 while the plate sits in place,
           1 once it has travelled roughly its own height up the viewport.
           Read from the element rather than from scrollY so it stays correct
           whatever the hero's height works out to. */
        // Measured on the PLATE, not the oversized canvas, so CANVAS_PAD
        // cannot quietly change how fast the dispersal runs.
        const plateEl = photoWrap || holder
        const scrollProgress = () => {
          const r = plateEl.getBoundingClientRect()
          if (r.height <= 0) return 0
          return Math.min(1, Math.max(0, -r.top / (r.height * 0.9)))
        }

        let raf = 0
        let last = performance.now()
        const tick = (now) => {
          raf = requestAnimationFrame(tick)
          const dt = Math.min(0.05, (now - last) / 1000)
          last = now
          const p = scrollProgress()
          material.uniforms.uTime.value += dt
          material.uniforms.uMouse.value.lerp(mouseTarget, 0.05)
          material.uniforms.uScroll.value = p
          /* The photograph underneath dissolves with the dots. It is the
             WRAPPER that is driven, so this never fights the <img>'s own
             transition (or React's style prop) on the initial reveal. */
          if (photoWrap) photoWrap.style.opacity = String(1 - p)
          renderer.render(scene, camera)
        }

        // Nothing to draw once the hero has left: stop the loop entirely
        // rather than burning a frame budget behind the rest of the page.
        let visible = true
        const io = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting
            if (visible && !reduceMotion && !raf) {
              last = performance.now()
              raf = requestAnimationFrame(tick)
            } else if (!visible && raf) {
              cancelAnimationFrame(raf)
              raf = 0
            }
          },
          { threshold: 0 },
        )
        io.observe(holder)

        if (reduceMotion) {
          // One settled frame, no loop, no pointer tracking, no dispersal.
          material.uniforms.uTime.value = 4
          renderer.render(scene, camera)
        } else {
          window.addEventListener('pointermove', onPointer, { passive: true })
          raf = requestAnimationFrame(tick)
        }

        const onResize = () => {
          const w2 = holder.clientWidth
          const h2 = holder.clientHeight
          if (!w2 || !h2) return
          renderer.setSize(w2, h2)
          camera.left = -w2 / 2
          camera.right = w2 / 2
          camera.top = h2 / 2
          camera.bottom = -h2 / 2
          camera.updateProjectionMatrix()
          const f = fitFor(w2, h2, img.naturalWidth, img.naturalHeight)
          material.uniforms.uRes.value.set(w2, h2)
          material.uniforms.uOffset.value.set(f.offsetX, f.offsetY)
          material.uniforms.uDraw.value.set(f.drawW, f.drawH)
          material.uniforms.uCellPx.value = f.drawW / W
          material.uniforms.uPlateOrigin.value.set(f.plateX, f.plateY)
          material.uniforms.uPlateSize.value.set(f.plateW, f.plateH)
          if (reduceMotion) renderer.render(scene, camera)
        }
        window.addEventListener('resize', onResize)

        setReady(true)

        cleanup = () => {
          cancelAnimationFrame(raf)
          io.disconnect()
          window.removeEventListener('pointermove', onPointer)
          window.removeEventListener('resize', onResize)
          if (photoWrap) photoWrap.style.opacity = ''
          geometry.dispose()
          material.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch {
        // WebGL unavailable: the photograph below is already the fallback.
        setReady(false)
      }
    }

    return () => {
      disposed = true
      cleanup()
    }
  }, [reduceMotion, src])

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* The photograph, held under the dots exactly as the reference does.
          At full strength until the canvas is up, so there is never a gap.
          The wrapper carries the scroll dissolve; the <img> carries the
          one-off reveal, so the two never overwrite each other. */}
      <div ref={photoWrapRef} className="absolute inset-0">
        <img
          src={src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-[50%_12%] transition-opacity duration-1000"
          style={{ opacity: ready ? PHOTO_OPACITY : 1 }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      {/* Deliberately larger than the plate — see CANVAS_PAD. */}
      <div ref={holderRef} className="absolute -inset-[30%]" aria-hidden />
    </div>
  )
}
