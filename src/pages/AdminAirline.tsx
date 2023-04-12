import { ChangeEvent, useEffect, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import EditFlights from "../components/EditFlights"

export default function AdminAirline() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, company } = useAuth()

  return (
    <div className="max-w-max">
      <div className="flex justify-between p-2">
        <h1>{company?.co_name}</h1>
        <div>IATA Code: {company?.co_iata_code}</div>
      </div>
      <EditFlights />
    </div>
  )
}
