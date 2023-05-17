import { ChangeEvent, Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react"
import { imageClear, imageUtils } from "../services/image.utils"
import { imageSave, imgFileInput } from "../services/imagefile.loader"
import { ActionCreatorWithPayload } from "@reduxjs/toolkit"

interface IProps {
  path: string
  url: string | undefined
  id: number | undefined
  imgLoaded: boolean
  setImgLoaded: Dispatch<SetStateAction<boolean>>
  imgUpdateQuery: any
  imgRemoveQuery: any
  setCanvasRef?: Dispatch<SetStateAction<RefObject<HTMLCanvasElement> | null>>
  imgUrlUpdateAction?: ActionCreatorWithPayload<{
    imgUrl: string | undefined
  }>
}

export default function ImgEditor({ imgEditorProps }: { imgEditorProps: IProps }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxView = 200

  const { path, url, id, imgLoaded, setImgLoaded, imgUpdateQuery, imgRemoveQuery, imgUrlUpdateAction, setCanvasRef } =
    imgEditorProps

  useEffect(() => {
    const loadImageToCanvas = async () => {
      if (url && url !== "undefined") {
        const image = await imageUtils(canvasRef, maxView)
        image.src = import.meta.env.VITE_API_URL + path + url
        setImgLoaded(true)
      }
    }
    setImgLoaded(false)
    if (setCanvasRef) setCanvasRef(canvasRef)
    loadImageToCanvas()
  }, [canvasRef, url, id])

  async function handleImageFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (setCanvasRef) setCanvasRef(canvasRef)
    await imgFileInput(e, maxView, canvasRef)
    setImgLoaded(true)
  }

  function handleImageRemove() {
    imageClear(canvasRef, maxView)
    const oldUrl = url
    if (imgUrlUpdateAction) imgUrlUpdateAction({ imgUrl: undefined })
    imgRemoveQuery(oldUrl)
  }

  function handleImageCancel() {
    setImgLoaded(false)
    imageClear(canvasRef, maxView)
  }

  async function handleImageSave() {
    setImgLoaded(false)
    const imgUrl = crypto.randomUUID()
    try {
      if (!canvasRef.current) return
      await imageSave(canvasRef.current, maxView, imgUpdateQuery, imgUrl, id)
      if (imgUrlUpdateAction) imgUrlUpdateAction({ imgUrl })
    } catch (e) {
      console.log(e)
    }
  }

  const buttonClasses =
    "flex px-2 lg:px-4 py-1 mt-4 mb-1 text-lg items-center rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
  return (
    <div className="relative w-full flex justify-center">
      <canvas ref={canvasRef} width="200px" height="200px" className="border border-slate-500 w-[200px] h-[200px]" />
      {!imgLoaded ? (
        <label className="absolute top-0 flex flex-col justify-center items-center w-[200px] h-[200px] bg-slate-300 dark:bg-slate-700 active:scale-90 cursor-pointer opacity-60 hover:opacity-90">
          <i className="fas fa-cloud-arrow-up text-4xl" />
          <span>Upload Image</span>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileInput}
          />
        </label>
      ) : (
        imgUrlUpdateAction && (
          <div className="md:absolute flex flex-col right-0 bottom-0 justify-end items-left ml-3">
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
        )
      )}
    </div>
  )
}
