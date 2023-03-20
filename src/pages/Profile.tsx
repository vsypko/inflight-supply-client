import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useActions } from "../hooks/actions"
import { handleFileInput } from "../services/profile.service"

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate("/auth")
  }, [user])

  const [isImageLoaded, setImageLoaded] = useState(false)
  const [firstnameIsEntering, setFirstnameIsEntering] = useState(false)
  const [lastnameIsEntering, setLastnameIsEntering] = useState(false)
  const [value, setValue] = useState({
    firstname: user?.usr_firstname,
    lastname: user?.usr_lastname,
    photourl: user?.usr_photourl,
  })
  const { update } = useActions()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 192
  let ctx: CanvasRenderingContext2D | null

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      ctx = canvas.getContext("2g") as CanvasRenderingContext2D
    }
  }, [canvasRef.current])

  function handlePhotoInput(e: ChangeEvent<HTMLInputElement>) {
    handleFileInput(e, maxView, setImageLoaded, canvasRef)
  }

  function handlePhotoRemove() {
    if (!canvasRef.current) return
    canvasRef.current.onwheel = null
    canvasRef.current.onpointerdown = null
    ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, maxView, maxView)
    setValue((prev) => ({ ...prev, photourl: "" }))
    setImageLoaded(false)
  }

  function handlePhotoSave() {
    if (!canvasRef.current) return
    ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const data = canvasRef.current.toDataURL("image/jpeg", 0.5)

    ctx.clearRect(0, 0, maxView, maxView)
    setValue({ ...value, photourl: data })
    setImageLoaded(false)
  }

  function handleSave() {
    setFirstnameIsEntering(false)
    setLastnameIsEntering(false)
    update(value)
  }

  return (
    <div className="flex flex-col items-center text-lg">
      <h1 className="w-full py-4 text-center text-3xl font-bold">PROFILE</h1>
      <div className="w-full md:w-1/2 px-4 md:px-0">
        <div className="flex p-1 border border-spacing-1 rounded-xl border-slate-600 dark:border-slate-100 justify-center relative">
          <canvas ref={canvasRef} width="190px" height="190px" className="absolute" />
          <div className="w-[190px] h-[190px] bg-slate-400 dark:bg-slate-600 flex justify-center items-center">
            <i className="fas fa-cloud-arrow-up text-4xl" />
          </div>
          {!isImageLoaded && (
            <>
              <label
                htmlFor="photo"
                className="absolute right-2 bottom-2 flex active:text-sm active:py-0.5 cursor-pointer px-2 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800"
              >
                <i className="fas fa-camera pt-1 pr-2" />
                <p>Upload photo</p>
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoInput}
              />
            </>
          )}
          {isImageLoaded && (
            <>
              <button
                onClick={handlePhotoRemove}
                className="absolute top-0 right-4 rounded-full px-2 text-3xl opacity-70 active:text-2xl active:px-1.5 active:right-5 hover:opacity-100"
              >
                <i className="fas fa-xmark " />
              </button>
              <button
                onClick={handlePhotoSave}
                className="absolute bottom-2 right-2 px-3 text-lg active:px-2.5 active:right-4 active:text-base rounded-full bg-teal-400 hover:bg-teal-500 dark:bg-teal-900 dark:hover:bg-teal-800"
              >
                SAVE
              </button>
            </>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 mt-6 w-full group">
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="first_name"
                className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-2 peer-focus:scale-80 peer-focus:-translate-y-12"
              >
                <i className="far fa-user mr-2" />
                First Name
              </label>
            </div>
            <div className="relative z-0 mt-6 w-full group">
              <input
                type="text"
                name="last_name"
                id="last_name"
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="last_name"
                className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-2 peer-focus:scale-80 peer-focus:-translate-y-12"
              >
                <i className="fas fa-user mr-2" />
                Last Name
              </label>
            </div>
            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <p className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="far fa-envelope mr-2" />
                Email
              </p>
              <span className="text-slate-800 dark:text-slate-200">{user?.usr_email}</span>
            </div>
            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <p className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-mobile-screen-button mr-2"></i>
                Phone
              </p>
              <span className="text-slate-800 dark:text-slate-200">{user?.usr_phone}</span>
            </div>
            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <p className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-building-user mr-2" />
                Company
              </p>
              <span className="text-slate-800 dark:text-slate-200">{user?.co_name}</span>
            </div>
            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <p className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-user-shield mr-2"></i>
                Role
              </p>
              <span className="text-slate-800 dark:text-slate-200">{user?.role_name}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
