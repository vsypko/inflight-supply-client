import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useActions } from "../hooks/actions"
import { useAuth } from "../hooks/useAuth"
import { imageLoader } from "../services/image.loader"
import { dataUrlToBlob, handleFileInput } from "../services/profile.service"
import { useUserUrlRemoveMutation, useUserUrlUpdateMutation } from "../store/auth/auth.api"

export default function ImageEditor({
  setPhotoEdit,
}: {
  setPhotoEdit: Dispatch<SetStateAction<boolean>>
}): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()
  const { updateUserUrl } = useActions()
  const [userUrlUpdateQuery] = useUserUrlUpdateMutation()
  const [userUrlRemoveQuery] = useUserUrlRemoveMutation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 200

  useEffect(() => {
    const loadImageToCanvas = async () => {
      if (user && user.usr_url) {
        const image = await imageLoader(canvasRef, maxView)
        image.src = import.meta.env.VITE_API_URL + "user/geturl/" + user!.usr_url
        setImageLoaded(true)
      }
    }
    loadImageToCanvas()
  }, [canvasRef])

  function handlePhotoInput(e: ChangeEvent<HTMLInputElement>) {
    handleFileInput(e, maxView, setImageLoaded, canvasRef)
  }

  function handlePhotoRemove() {
    if (!canvasRef.current) return
    canvasRef.current.onwheel = null
    canvasRef.current.onpointerdown = null
    const ctx = canvasRef.current.getContext("2d")
    ctx?.clearRect(0, 0, maxView, maxView)
    updateUserUrl({ url: undefined, url_data: undefined })
    userUrlRemoveQuery(user!.usr_url)
    setImageLoaded(false)
  }

  function handlePhotoCancel() {
    setImageLoaded(false)
    setPhotoEdit(false)
  }

  async function handlePhotoSave() {
    let dataUrl = canvasRef.current?.toDataURL()
    if (!dataUrl) return
    let userUrl: string
    let newUrl: boolean
    if (!user?.usr_url) {
      userUrl = crypto.randomUUID()
      newUrl = true
    } else {
      userUrl = user.usr_url
      newUrl = false
    }
    try {
      const photoInBlob = dataUrlToBlob(dataUrl)
      const photo = new FormData()
      photo.append("photo", photoInBlob, `${userUrl}`)
      photo.append("id", `${user!.usr_id}`)
      photo.append("newUrl", `${newUrl}`)
      const ctx = canvasRef.current?.getContext("2d")
      ctx?.clearRect(0, 0, maxView, maxView)
      await userUrlUpdateQuery(photo).unwrap()
      updateUserUrl({ url: userUrl, url_data: dataUrl })
      setImageLoaded(false)
      setPhotoEdit(false)
    } catch (e) {
      console.log(e)
    }
  }
  const buttonClasses =
    "flex px-2 lg:px-4 py-1 mt-4 mb-1 text-base lg:text-lg items-center rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
  return (
    <>
      <canvas
        ref={canvasRef}
        width="200px"
        height="200px"
        className="absolute border border-slate-500 border-spacing-1"
      />
      {!imageLoaded && (
        <>
          <div className="w-[200px] h-[200px] bg-slate-400 dark:bg-slate-600 flex justify-center items-center">
            <i className="fas fa-cloud-arrow-up text-4xl" />
          </div>
          <label
            htmlFor="photo"
            className="absolute right-0 bottom-1 lg:text-xl lg:px-3 lg:right-2 active:scale-90 cursor-pointer px-1 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-camera mr-2" />
            <span>Upload photo</span>
          </label>
          <input id="photo" name="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoInput} />
        </>
      )}
      {imageLoaded && (
        <div className="flex flex-col absolute right-0 bottom-0 lg:right-4">
          <button onClick={handlePhotoRemove} className={buttonClasses}>
            <i className="fas fa-trash-can mr-2" />
            <span>Remove</span>
          </button>

          <button onClick={handlePhotoCancel} className={buttonClasses}>
            <i className="fas fa-arrow-turn-up mr-2" />
            <span>Return</span>
          </button>

          <button onClick={handlePhotoSave} className={buttonClasses}>
            <i className="fas fa-download mr-2" />
            <span>Save</span>
          </button>
        </div>
      )}
    </>
  )
}
