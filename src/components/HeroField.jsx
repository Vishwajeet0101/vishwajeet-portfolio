import { lazy, Suspense } from 'react'
import portraitUrl from '../assets/portrait.jpg'

/*
 * The particle portrait needs three.js, which is ~530 kB for one decorative
 * plate above the fold. Splitting it out keeps the main chunk small: the page
 * paints with the plain photograph, then the canvas swaps in over it.
 */
const PortraitField = lazy(() =>
  import('./PortraitField').then((m) => ({ default: m.PortraitField })),
)

/** Shown until the WebGL chunk arrives — and it is what prints, too. */
function StaticPortrait({ src }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover object-[50%_12%]"
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  )
}

/** `src` is an uploaded portrait URL; empty falls back to the bundled photo. */
export function HeroField({ src }) {
  const url = src || portraitUrl
  return (
    <Suspense fallback={<StaticPortrait src={url} />}>
      <PortraitField src={url} />
    </Suspense>
  )
}
