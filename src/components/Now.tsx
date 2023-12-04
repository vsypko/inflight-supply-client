import { useEffect, useState } from "react"

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
  return <div className="absolute right-0 top-8 md:top-0">{now.toUTCString()}</div>
}
