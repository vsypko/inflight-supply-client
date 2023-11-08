import { useState, DragEvent, MouseEvent } from "react"
import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import DragableBox from "../components/DragableBox"
import DropArea from "../components/DropArea"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const [pos, setPos] = useState({ x: 700, y: 300, dx: 0, dy: 0 })

  return (
    <DropArea setPos={setPos}>
      <div className="w-full py-4 text-center text-3xl font-bold mt-14">INFLIGHT SUPPLY ORDERS</div>
      {!airport.name && (
        <div>
          <div>AIRPORT NOT SELECTED</div>
          <div>Select an airport on the AIRPORTS tab</div>
        </div>
      )}
      {airport.name && (
        <div>
          <div className="flex text-2xl font-bold">
            <pre className="uppercase">{airport.name}</pre>
            <pre className="ml-6">{airport.iata}</pre>
          </div>
        </div>
      )}

      <pre>No one supplier selected</pre>
      <pre>Choose a supplier for the selected airport:</pre>
      <pre>Enter into Standard Inflight Catering Agreement (SICA 2022) with them</pre>
      <DragableBox pos={pos} setPos={setPos}>
        <img src={`data:image/png;base64, ${user.flag}`} alt="" className="pr-2" draggable={false} />
        <pre>
          +{user?.country_iso === "ZZ" ? "" : user.phonecode}-{user?.phone}
        </pre>
      </DragableBox>
    </DropArea>
  )
}
