import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user)

  return useMemo(() => ({ user }), [user])
}
