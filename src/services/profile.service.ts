import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react"
import { imageLoader } from "./image.loader"

export function handleFileInput(
  e: ChangeEvent<HTMLInputElement>,
  maxView: number,
  setLoaded: Dispatch<SetStateAction<boolean>>,
  canvasRef: RefObject<HTMLCanvasElement>,
) {
  e.preventDefault()
  const photo = e.target.files?.[0]
  if (!photo) return
  const reader = new FileReader()

  reader.readAsDataURL(photo)

  reader.onloadend = async (e) => {
    const image = await imageLoader(canvasRef, maxView)
    image.src = e.target?.result as string
    if (image) setLoaded(true)
  }
}

export function dataUrlToBlob(data: string): Blob {
  data = data.replace(/^data:image\/jpeg;base64,/, "")
  const binaryString = window.atob(data)
  const uint8Array = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  return new Blob([uint8Array], { type: "image/jpeg" })
}
