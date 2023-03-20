import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useActions } from "../hooks/actions"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "../store/auth/auth.api"
import { useAuth } from "../hooks/useAuth"

interface IAuthCredentials {
  isLogin: boolean
  email: string
  password: string
}

export default function Auth() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate("/")
  }, [user])

  const initialValue: IAuthCredentials = { isLogin: true, email: "", password: "" }
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [errorMsg, setErrorMsg] = useState("")
  const [login, { isLoading, error }] = useLoginMutation()
  const { setCredentials } = useActions()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((value) => ({ ...value, [event.target.name]: event.target.value }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const data = await login(value).unwrap()
      if (data) setCredentials(data)
      navigate("/")
    } catch (err) {
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  return (
    <div className="flex flex-col items-center w-full px-5 text-slate-700 dark:text-slate-300">
      <div className="flex flex-col items-center mt-6 sm:w-1/4 w-full">
        <h1 className="text-xl font-bold md:text-2xl mb-6">
          {value.isLogin ? "Sign in to your account" : "Create an account"}
        </h1>
        {error && <h5 className="text-red-500 mb-2 text-center whitespace-pre-line">{errorMsg}</h5>}
        <form onSubmit={onSubmit} className="w-full">
          <div className="w-full">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <div className="flex bg-gray-300 dark:bg-gray-700 rounded-full mb-6">
              <i className="fas fa-envelope p-3 rounded-l-full bg-slate-400 dark:bg-slate-800" />
              <input
                autoFocus
                type="email"
                name="email"
                id="email"
                className="w-full bg-transparent p-2 outline-none invalid:text-slate-500"
                placeholder="name@domain.ext"
                required
                onChange={onChange}
              />
              <i className="p-5 rounded-r-full text-slate-700 " />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <div className="flex bg-gray-300 dark:bg-gray-700 rounded-full mb-6">
              <i className="fas fa-key p-3 rounded-l-full bg-slate-400 dark:bg-slate-800" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                minLength={6}
                maxLength={12}
                placeholder="••••••"
                className="w-full bg-transparent p-2 outline-none invalid:text-slate-500"
                required
                onChange={onChange}
              />
              <i
                className={
                  "fas mt-3 mr-3 rounded-r-full active:text-sm cursor-pointer " +
                  (passwordVisible ? "fa-eye-slash" : "fa-eye")
                }
                onClick={() => setPasswordVisible((prev) => !prev)}
              />
            </div>
          </div>
          {value.isLogin && (
            <div className="flex items-center justify-between mb-6">
              <a
                href="#"
                className="text-sm py-1 px-2 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 active:text-xs active:py-1.5"
              >
                Forgot password?
              </a>
            </div>
          )}
          <button
            type="submit"
            className="w-full cursor-pointer p-1 px-5 active:px-6 flex justify-between text-xl items-center ring-2 active:ring-0 rounded-full bg-teal-400 hover:bg-teal-500 ring-teal-400 hover:ring-teal-500 dark:bg-teal-900 dark:hover:bg-teal-800 dark:ring-teal-900 dark:hover:ring-teal-800"
          >
            <i className={"fas " + (value.isLogin ? "fa-right-to-bracket" : "fa-user-plus")} />
            {value.isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="flex justify-between items-center text-lg mt-6">
          {value.isLogin ? "Don't have an account yet?" : "Have an account?"}
          <button
            onClick={() => {
              setValue((value) => ({ ...value, isLogin: !value.isLogin }))
              setErrorMsg("")
            }}
            className="px-2 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 active:text-base text-teal-500"
          >
            {value.isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="mt-10">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
