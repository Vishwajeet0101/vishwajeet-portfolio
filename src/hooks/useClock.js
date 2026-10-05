import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

/** Live local time where Vishwajeet is, refreshed every 10s. */
export function useClock() {
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatter.format(new Date())), 10000)
    return () => clearInterval(id)
  }, [])

  return time
}
