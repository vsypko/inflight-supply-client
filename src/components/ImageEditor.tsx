import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useActions } from "../hooks/actions"
import { useAuth } from "../hooks/useAuth"
import { imageLoader } from "../services/image.loader"
import { dataUrlToBlob, handleFileInput } from "../services/profile.service"
import { usePhotoUpdateMutation } from "../store/auth/auth.api"

interface ImageEditorProps {
  setPhotoEdit: Dispatch<SetStateAction<boolean>>
}

export default function ImageEditor({ setPhotoEdit }: ImageEditorProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()
  const { updateAuth } = useActions()

  const [photoUpdate, { isLoading, error }] = usePhotoUpdateMutation()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 200

  useEffect(() => {
    const image = imageLoader(canvasRef, maxView, setImageLoaded)
    image.src = import.meta.env.VITE_USER_URL + user!.usr_url
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
    setImageLoaded(false)
  }

  async function handlePhotoSave() {
    let data = canvasRef.current?.toDataURL("image/jpeg", 1)
    if (!data) return
    const photoInBlob = dataUrlToBlob(data)
    const photo = new FormData()
    photo.append("photo", photoInBlob, `${user!.usr_url}`)
    photo.append("id", `${user!.usr_id}`)

    try {
      const updatedPhoto = await photoUpdate(photo).unwrap()
      updateAuth({
        firstname: user?.usr_firstname,
        lastname: user?.usr_lastname,
      })
    } catch (e) {
      console.log(e)
    }
    const ctx = canvasRef.current?.getContext("2d")
    ctx?.clearRect(0, 0, maxView, maxView)
    setImageLoaded(false)
    setPhotoEdit(false)
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
            className="absolute right-2 bottom-2 flex active:scale-90 cursor-pointer px-2 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-camera pt-1 pr-2" />
            <span>Upload photo</span>
          </label>
          <input id="photo" name="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoInput} />
        </>
      )}
      {imageLoaded && (
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
    </>
  )
}
