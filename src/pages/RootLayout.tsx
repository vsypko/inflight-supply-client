import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import MainNavigation from "../components/MainNavigation"
import { useActions } from "../hooks/actions"
import { useLoginMutation } from "../store/auth/auth.api"

export default function RootLayout() {
  const [errorMsg, setErrorMsg] = useState("")
  const [login, { isLoading, error }] = useLoginMutation()
  const { setCredentials } = useActions()

  useEffect(() => {
    const reauth = async () => {
      try {
        setErrorMsg("")
        const data = await login({ isLogin: true }).unwrap()
        if (data) setCredentials(data)
      } catch (err) {
        if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
        if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
      }
    }
    reauth()
  }, [])

  return (
    <>
      <MainNavigation />
      <section className="text-slate-700 dark:text-slate-300">
        <Outlet />
      </section>
    </>
  )
}
