import { useMemo } from "react"
import { useAppSelector } from "./redux"

export const useAuth = () => {
  const { user } = useAppSelector((state) => state.auth)
  return useMemo(() => ({ user }), [user])
}
