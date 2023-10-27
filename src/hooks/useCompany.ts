import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useCompany = () => {
  const { company } = useAppSelector((state) => state.company)
  return useMemo(() => ({ company }), [company])
}
