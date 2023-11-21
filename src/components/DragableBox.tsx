import { ReactNode, PointerEvent, SetStateAction, Dispatch } from "react"

type Pos = {
  draged: boolean
  x: number
  y: number
  dx: number
  dy: number
  index: number
}
type Props = {
  id: string
  pos: Pos
  setPos: Dispatch<SetStateAction<Pos>>
  classes: string
  children: ReactNode
}

export default function DragableBox({ id, pos, setPos, classes, children }: Props) {
  function handlePointerDown(e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    setPos({ ...pos, draged: true, dx: e.pageX - pos.x, dy: e.pageY - pos.y })
  }

  return (
    <div
      id={id}
      className={classes}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  )
}
