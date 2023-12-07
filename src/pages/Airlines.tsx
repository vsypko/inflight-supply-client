import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { Contract } from "../types/company.types"

import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery, useGetScheduledFlightsQuery } from "../store/contracts/contract.api"
import SupplierSelector from "../components/SupplierSelector"
import { useState } from "react"
import DateInput from "../components/DateInput"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { data: contracts } = useGetContractsQuery(
    { airport: airport.id, company: company.id, category: company.category },
    {
      skip: !airport.id || !company.id || company.category === "supplier",
      refetchOnFocus: true,
    },
  )

  const { data: flights } = useGetScheduledFlightsQuery(
    {
      airport: airport.iata,
      company: company.id,
      date: new Date().toISOString().slice(0, 10),
    },
    { refetchOnFocus: true },
  )
  console.log(flights)

  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10))
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10))
  console.log(dateFrom, dateTo)

  return (
    <div className="w-full text-xl px-2">
      <div className="w-full text-center text-2xl md:text-3xl font-bold">INFLIGHT SUPPLY ORDERS</div>
      <div className="uppercase font-semibold">
        {airport.name ? airport.name + " - " + airport.iata : "AIRPORT NOT SELECTED"}
      </div>
      {!airport.name && <span>Select an airport on the AIRPORTS tab</span>}

      {contracts && contracts.length > 0 && (
        <div className="max-w-max">
          {contracts[0].signed_at && (
            <div className="">
              <div>
                {`The contract with ${contracts[0].name} is in force from 
                      ${new Date(contracts[0].signed_at).toDateString()} 
                    `}
              </div>
              <div className="flex justify-between">
                <DateInput date={dateFrom} setDate={setDateFrom} />
                <DateInput date={dateTo} setDate={setDateTo} />
              </div>
            </div>
          )}
          {!contracts[0].signed_at && <div>{`The contract with ${contracts[0].name} is pending...`}</div>}
        </div>
      )}
      {!contracts || (contracts.length === 0 && <SupplierSelector />)}
    </div>
  )
}
