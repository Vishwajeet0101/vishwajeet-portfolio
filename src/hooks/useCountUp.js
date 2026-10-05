import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useCountUp(end, duration = 1.2, startWhen = true) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!startWhen) return
    const controls = animate(0, end, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [end, duration, startWhen])

  return value
}
