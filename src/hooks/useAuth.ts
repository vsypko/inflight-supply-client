import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useAuth = () => {
  const { user, company, country, token } = useAppSelector((state) => state.auth)
  return useMemo(() => ({ user, company, country, token }), [user, company, country, token])
}
