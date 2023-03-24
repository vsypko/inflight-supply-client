import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user)
  const company = useAppSelector((state) => state.auth.company)
  const country = useAppSelector((state) => state.auth.country)

  return useMemo(() => ({ user, company, country }), [user, company, country])
}
