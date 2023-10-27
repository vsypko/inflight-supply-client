import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useAirport = () => {
  const { airport } = useAppSelector((state) => state.airport)
  return useMemo(() => ({ airport }), [airport])
}
