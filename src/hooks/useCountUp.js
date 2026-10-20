import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* MotionConfig's reducedMotion only reaches motion components and the CSS
   media query only reaches CSS animations — neither governs the imperative
   animate() below, so the preference has to be read here too. When it's set,
   no animation runs and the number is simply its final value. */
export function useCountUp(end, duration = 1.2, startWhen = true) {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!startWhen || reduceMotion) return
    const controls = animate(0, end, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [end, duration, startWhen, reduceMotion])

  return reduceMotion ? end : value
}
