import { ReactNode, DragEvent, SetStateAction, Dispatch } from "react"

type Pos = {
  x: number
  y: number
  dx: number
  dy: number
}

type Props = {
  setPos: Dispatch<SetStateAction<Pos>>
  children: ReactNode
}

export default function DropArea({ setPos, children }: Props) {
  function handleDragOver(e: DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setPos((pos) => ({ ...pos, x: e.pageX - pos.dx, y: e.pageY - pos.dy }))
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden -mt-14 ">
      <div className="w-full h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
        {children}
      </div>
    </div>
  )
}
