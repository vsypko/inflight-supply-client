import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react"
import { imageUtils } from "./image.utils"

export async function imgFileInput(
  e: ChangeEvent<HTMLInputElement>,
  maxView: number,
  canvasRef: RefObject<HTMLCanvasElement>,
) {
  e.preventDefault()
  const pic = e.target.files?.[0]
  if (!pic) return
  const reader = new FileReader()
  reader.readAsDataURL(pic)
  reader.onloadend = async (e) => {
    const image = await imageUtils(canvasRef, maxView)
    image.src = e.target?.result as string
  }
}

function dataUrlToBlob(data: string): Blob {
  data = data.replace(/^data:image\/png;base64,/, "")
  const binaryString = window.atob(data)
  const uint8Array = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  return new Blob([uint8Array], { type: "image/png" })
}

export async function imageSave(
  canvas: HTMLCanvasElement | null,
  maxView: number,
  imgUpdateQuery: any,
  imgUrl: string,
  id?: number,
  type?: string,
) {
  let dataUrl = canvas?.toDataURL()
  if (!dataUrl) return

  try {
    const imageInBlob = dataUrlToBlob(dataUrl)
    const image = new FormData()
    image.append("image", imageInBlob, `${imgUrl}`)
    if (id) image.append("id", `${id}`)
    if (type) image.append("type", `${type}`)
    const ctx = canvas?.getContext("2d")
    ctx?.clearRect(0, 0, maxView, maxView)

    //request API for save or update image --------------------------------------------------------------------
    await imgUpdateQuery(image).unwrap()
  } catch (e) {
    console.log(e)
  }
}
