import { useState, DragEvent, MouseEvent, useEffect } from "react"
import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import DragableBox from "../components/DragableBox"
import DropArea from "../components/DropArea"
import { useGetCompaniesForAirportQuery } from "../store/company/company.api"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const [pos, setPos] = useState({ x: 700, y: 300, dx: 0, dy: 0 })
  const {
    data: suppliers,
    isLoading,
    error,
  } = useGetCompaniesForAirportQuery({ type: "supplier", airport: airport.id })

  useEffect(() => {
    console.log(suppliers)
  }, [suppliers])

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
            <span className="uppercase">{airport.name}</span>
            <span className="ml-6">{airport.iata}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <span>No one supplier selected</span>
        <span>Choose a supplier for the selected airport:</span>
        <span>Enter into Standard Inflight Catering Agreement (SICA 2022) with them</span>
      </div>
      <DragableBox pos={pos} setPos={setPos}>
        <img src={`data:image/png;base64, ${user.flag}`} alt="" className="pr-2" draggable={false} />
        <span>
          +{user?.country_iso === "ZZ" ? "" : user.phonecode}-{user?.phone}
        </span>
      </DragableBox>
    </DropArea>
  )
}
