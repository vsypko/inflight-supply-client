import { useEffect, useState } from 'react'

export default function Now() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  })
  return <span>{now.toUTCString()}</span>
}
