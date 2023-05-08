import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { imageUtils } from "../services/image.utils"
import { dataUrlToBlob, handleImgFileInput } from "../services/imagefile.loader"
import { ActionCreatorWithPayload } from "@reduxjs/toolkit"

interface IProps {
  path: string
  url: string | undefined
  id: number | undefined
  setImageEdit: Dispatch<SetStateAction<boolean>>
  imgUpdateQuery: any
  imgRemoveQuery: any
  imgUrlUpdateAction?: ActionCreatorWithPayload<{
    url: string | undefined
  }>
}

export default function ImgEditor({ imgEditorProps }: { imgEditorProps: IProps }): JSX.Element {
  const { path, url, id, setImageEdit, imgUpdateQuery, imgRemoveQuery, imgUrlUpdateAction } = imgEditorProps

  const [imageLoaded, setImageLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 200

  useEffect(() => {
    const loadImageToCanvas = async () => {
      if (url) {
        const image = await imageUtils(canvasRef, maxView)
        image.src = import.meta.env.VITE_API_URL + path + url
        setImageLoaded(true)
      }
    }
    loadImageToCanvas()
  }, [canvasRef])

  function handleImageFileInput(e: ChangeEvent<HTMLInputElement>) {
    handleImgFileInput(e, maxView, setImageLoaded, canvasRef)
  }

  function handleImageRemove() {
    if (!canvasRef.current) return
    canvasRef.current.onwheel = null
    canvasRef.current.onpointerdown = null
    const ctx = canvasRef.current.getContext("2d")
    ctx?.clearRect(0, 0, maxView, maxView)

    const oldUrl = url
    if (imgUrlUpdateAction) imgUrlUpdateAction({ url: undefined })
    imgRemoveQuery(oldUrl)
    setImageLoaded(false)
  }

  function handleImageCancel() {
    setImageLoaded(false)
    setImageEdit(false)
  }

  async function handleImageSave() {
    let dataUrl = canvasRef.current?.toDataURL()
    if (!dataUrl) return
    const imageUrl = crypto.randomUUID()
    try {
      const imageInBlob = dataUrlToBlob(dataUrl)
      const image = new FormData()
      image.append("image", imageInBlob, `${imageUrl}`)
      image.append("id", `${id}`)
      const ctx = canvasRef.current?.getContext("2d")
      ctx?.clearRect(0, 0, maxView, maxView)

      //to be change-----------------------------------------------
      await imgUpdateQuery(image).unwrap()
      if (imgUrlUpdateAction) imgUrlUpdateAction({ url: imageUrl })
      setImageLoaded(false)
      setImageEdit(false)
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
      {!imageLoaded ? (
        <>
          <div className="w-[200px] h-[200px] bg-slate-400 dark:bg-slate-600 flex justify-center items-center">
            <i className="fas fa-cloud-arrow-up text-4xl" />
          </div>
          <label
            htmlFor="Image"
            className="absolute right-0 bottom-1 lg:text-xl lg:px-3 lg:right-2 active:scale-90 cursor-pointer px-1 hover:bg-slate-300 hover:rounded-full dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
          >
            <i className="fas fa-camera mr-2" />
            <span>Upload Image</span>
          </label>
          <input
            id="Image"
            name="Image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileInput}
          />
        </>
      ) : (
        <div className="flex flex-col absolute right-0 bottom-0 lg:right-4">
          <button onClick={handleImageRemove} className={buttonClasses}>
            <i className="fas fa-trash-can mr-2" />
            <span>Delete</span>
          </button>

          <button onClick={handleImageCancel} className={buttonClasses}>
            <i className="fas fa-arrow-turn-up mr-2" />
            <span>Cancel</span>
          </button>

          <button onClick={handleImageSave} className={buttonClasses}>
            <i className="fas fa-download mr-2" />
            <span>Save</span>
          </button>
        </div>
      )}
    </>
  )
}
