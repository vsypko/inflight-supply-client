import { useState, DragEvent, MouseEvent } from "react"
import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { useDebounce } from "../hooks/debounce"
import { useSearchAirportQuery } from "../store/airport/airport.api"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const [itemPos, setItemPos] = useState({ x: 700, y: 300 })

  let dx = 0
  let dy = 0

  function handleDragStart(e: DragEvent) {
    dx = e.pageX - itemPos.x
    dy = e.pageY - itemPos.y
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setItemPos({ x: e.pageX - dx, y: e.pageY - dy })
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden -mt-14 ">
      <div className="w-full py-4 text-center text-3xl font-bold mt-14">INFLIGHT SUPPLY ORDERS</div>
      <div className="w-full h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
        <div>Make orders for inflight supply in airport:</div>
        {!airport.name && (
          <div>
            <div>AIRPORT NOT SELECTED</div>
            <div>Select an airport on the AIRPORTS tab</div>
          </div>
        )}
        {airport.name && (
          <div>
            <div className="flex">
              <pre className="uppercase">{airport.name}</pre>
              <pre className="font-bold ml-6">{airport.iata}</pre>
            </div>
            <div className="flex w-80 justify-between">
              <pre>{airport.municipality}</pre>
              <pre>{airport.country}</pre>
            </div>
          </div>
        )}

        <pre>No one supplier selected</pre>
        <pre>Choose a supplier for the selected airport:</pre>
        <pre>Enter into Standard Inflight Catering Agreement (SICA 2022) with them</pre>
      </div>

      <div
        className={`flex border absolute hover:cursor-grab active:cursor-grabbing`}
        draggable="true"
        style={{ left: `${itemPos.x}px`, top: `${itemPos.y}px` }}
        onDragStart={handleDragStart}
      >
        <img src={`data:image/png;base64, ${user.flag}`} alt="" className="pr-2" draggable={false} />
        <pre>
          +{user?.country_iso === "ZZ" ? "" : user.phonecode}-{user?.phone}
        </pre>
      </div>
    </div>
  )
}
