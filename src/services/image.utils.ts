import { RefObject } from "react"

export async function imageUtils(canvasRef: RefObject<HTMLCanvasElement>, maxView: number) {
  const image = new Image()
  image.crossOrigin = "use-credentials"
  image.onload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, maxView, maxView)
    let width = image.width
    let height = image.height
    let adjust = maxView / Math.max(width, height)
    let aspect = width / height
    width = width * adjust
    height = height * adjust
    let x = (maxView - width) / 2
    let y = (maxView - height) / 2
    let posX = 0
    let posY = 0
    let isMoving = false
    ctx.drawImage(image, x, y, width, height)

    canvas.onwheel = (e) => {
      e.preventDefault()
      if (maxView < width - e.deltaY * 0.05 || maxView < height - e.deltaY * 0.05) {
        x = x + e.deltaY * 0.05
        y = y + e.deltaY * 0.05
        width = width - e.deltaY * 0.1 * aspect
        height = height - e.deltaY * 0.1
        ctx.clearRect(0, 0, maxView, maxView)
        ctx.drawImage(image, x, y, width, height)
      }
    }

    canvas.onpointerdown = (e) => {
      e.preventDefault()
      posX = e.offsetX
      posY = e.offsetY
      isMoving = true
    }

    canvas.onpointermove = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (isMoving) {
        if (
          x + e.offsetX - posX > 10 ||
          y + e.offsetY - posY > 10 ||
          x + e.offsetX - posX + width < maxView - 10 ||
          y + e.offsetY - posY + height < maxView - 10
        )
          return
        x = x + e.offsetX - posX
        y = y + e.offsetY - posY
        posX = e.offsetX
        posY = e.offsetY
        ctx.clearRect(0, 0, maxView, maxView)
        ctx.drawImage(image, x, y, width, height)
      }
    }

    canvas.onpointerup = () => {
      posX = 0
      posY = 0
      isMoving = false
    }

    canvas.onpointerout = () => {
      posX = 0
      posY = 0
      isMoving = false
    }
  }
  return image
}

export function imageRemove(canvasRef: RefObject<HTMLCanvasElement>, maxView: number) {
  if (!canvasRef.current) return
  canvasRef.current.onwheel = null
  canvasRef.current.onpointerdown = null
  canvasRef.current.onpointermove = null
  const ctx = canvasRef.current.getContext("2d")
  ctx?.clearRect(0, 0, maxView, maxView)
}
