import { ReactNode, DragEvent, SetStateAction, Dispatch } from "react"

type Pos = {
  x: number
  y: number
  dx: number
  dy: number
}
type Props = {
  pos: Pos
  setPos: Dispatch<SetStateAction<Pos>>
  children: ReactNode
}

export default function DragableBox({ pos, setPos, children }: Props) {
  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    setPos({ ...pos, dx: e.pageX - pos.x, dy: e.pageY - pos.y })
  }

  return (
    <div
      className={`flex border absolute hover:cursor-grab active:cursor-grabbing`}
      draggable="true"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  )
}
