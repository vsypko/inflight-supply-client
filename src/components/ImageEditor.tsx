import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useActions } from "../hooks/actions"
import { useAuth } from "../hooks/useAuth"
import { imageLoader } from "../services/image.loader"
import { dataUrlToBlob, handleFileInput } from "../services/profile.service"
import { useUrlDeleteMutation, useUrlUpdateMutation } from "../store/auth/auth.api"

interface ImageEditorProps {
  setPhotoEdit: Dispatch<SetStateAction<boolean>>
  setImgDataUrl: Dispatch<SetStateAction<string | undefined>>
}

export default function ImageEditor({ setPhotoEdit, setImgDataUrl }: ImageEditorProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()
  const { updateUserUrl } = useActions()
  const [setUserUrl, { isLoading, error }] = useUrlUpdateMutation()
  const [deleteUserUrl, response] = useUrlDeleteMutation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 200

  useEffect(() => {
    const loadImageToCanvas = async () => {
      if (user && user.usr_url) {
        const image = await imageLoader(canvasRef, maxView)
        image.src = import.meta.env.VITE_USER_URL + user.usr_url
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
    updateUserUrl("")
    deleteUserUrl(user!.usr_url)
    setImageLoaded(false)
  }

  function handlePhotoCancel() {
    setImageLoaded(false)
    setPhotoEdit(false)
  }

  async function handlePhotoSave() {
    let data = canvasRef.current?.toDataURL("image/jpeg", 1)
    if (!data) return
    setImgDataUrl(data)
    let userUrl: string
    let newUrl: boolean
    if (!user?.usr_url) {
      userUrl = crypto.randomUUID()
      updateUserUrl(userUrl)
      newUrl = true
    } else {
      userUrl = user.usr_url
      newUrl = false
    }
    try {
      const photoInBlob = dataUrlToBlob(data)
      const photo = new FormData()
      photo.append("photo", photoInBlob, `${userUrl}`)
      photo.append("id", `${user!.usr_id}`)
      photo.append("newUrl", `${newUrl}`)
      const ctx = canvasRef.current?.getContext("2d")
      ctx?.clearRect(0, 0, maxView, maxView)
      await setUserUrl(photo).unwrap()
      setImageLoaded(false)
      setPhotoEdit(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <canvas ref={canvasRef} width="200px" height="200px" className="absolute" />
      <div className="w-[200px] h-[200px] bg-slate-400 dark:bg-slate-600 flex justify-center items-center">
        <i className="fas fa-cloud-arrow-up text-4xl" />
      </div>
      {!imageLoaded && (
        <>
          <label
            htmlFor="photo"
            className="absolute right-0 bottom-1 active:scale-90 cursor-pointer px-1 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-camera mr-2" />
            <span>Upload photo</span>
          </label>
          <input id="photo" name="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoInput} />
        </>
      )}
      {imageLoaded && (
        <>
          <button
            onClick={handlePhotoRemove}
            className="absolute text-left text-sm bottom-24 right-0 px-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="far fa-trash-can mr-2" />
            <span>Remove</span>
          </button>

          <button
            onClick={handlePhotoCancel}
            className="absolute text-left text-sm bottom-12 right-2 px-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-arrow-turn-up mr-2" />
            <span>Return</span>
          </button>

          <button
            onClick={handlePhotoSave}
            className="absolute text-left text-sm bottom-1 right-4 px-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-download mr-2" />
            <span>Save</span>
          </button>
        </>
      )}
    </>
  )
}
