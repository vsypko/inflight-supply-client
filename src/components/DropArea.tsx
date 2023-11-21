import { ReactNode, PointerEvent, SetStateAction, Dispatch } from "react"

type Pos = {
  draged: boolean
  x: number
  y: number
  dx: number
  dy: number
}

type Props<Pos> = {
  positions: {
    pos: Pos
    setPos: Dispatch<SetStateAction<Pos>>
  }[]
  children: ReactNode
}

export default function DropArea({ positions, children }: Props<Pos>): JSX.Element {
  function handlePointerUp(e: PointerEvent) {
    e.preventDefault()
    positions.forEach((position) => position.setPos({ ...position.pos, draged: false }))
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault()
    positions.forEach((position) => {
      if (position.pos.draged)
        position.setPos({ ...position.pos, x: e.pageX - position.pos.dx, y: e.pageY - position.pos.dy })
    })
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden -mt-14">
      <div
        className="w-full h-full"
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      >
        {children}
      </div>
    </div>
  )
}
