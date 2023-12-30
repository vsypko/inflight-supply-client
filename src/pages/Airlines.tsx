import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { Contract, Flight } from "../types/company.types"

import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery } from "../store/contracts/contract.api"
import SupplierSelector from "../components/SupplierSelector"
import { PointerEvent, useEffect, useState } from "react"
import DateInput from "../components/DateInput"
import { useGetFlightsQuery } from "../store/orders/orders.api"
import { ctrlSelection, selectAll, shiftSelection } from "../services/flights.selector"
import SupplyDiagram from "../components/SupplyDiagram"

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

  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10))
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10))
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedFlights, setSelectedFlights] = useState<number[]>([])
  const [selectedDestination, setSelectdedDestination] = useState("")
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])

  const { data: flights } = useGetFlightsQuery(
    {
      airport: airport.iata,
      company: company.id,
      datefrom: dateFrom,
      dateto: dateTo,
    },
    { refetchOnFocus: true },
  )

  function handleSelect(e: PointerEvent<HTMLLIElement>, index: number) {
    e.preventDefault()
    if (e.shiftKey && selectedFlights.length === 1) {
      setSelectedFlights(shiftSelection(selectedFlights[0], index))
      return
    }
    if (e.ctrlKey) {
      setSelectedFlights(ctrlSelection([...selectedFlights], index))
      return
    }
    setSelectedFlights([index])
  }

  function handleSelectAll() {
    setSelectedFlights([])
    if (filteredFlights && filteredFlights.length !== selectedFlights.length)
      setSelectedFlights(selectAll(filteredFlights.length))
  }

  useEffect(() => {
    if (flights && flights.length > 0) {
      setFilteredFlights(flights)
      const destinationsList = flights.map((flight: Flight) => flight.to)
      setDestinations([...new Set(destinationsList as string[])])
    }
    if (selectedDestination) setFilteredFlights(flights.filter((flight: Flight) => flight.to === selectedDestination))
    setSelectedFlights([])
  }, [flights, selectedDestination])

  return (
    <div className="w-full text-xl px-2">
      <div className="w-full text-center text-2xl md:text-3xl font-bold">INFLIGHT SUPPLY ORDERS</div>
      <div className="uppercase font-semibold">
        {airport.name ? airport.name + " - " + airport.iata : "AIRPORT NOT SELECTED"}
      </div>
      {!airport.name && <span>Select an airport on the AIRPORTS tab</span>}

      {contracts && contracts.length > 0 && (
        <div className="">
          {contracts[0].signed_at && (
            <div className="flex w-full">
              <div className="w-1/4">
                <div>
                  {`The contract with ${contracts[0].name} is in force from 
                      ${new Date(contracts[0].signed_at).toDateString()} 
                    `}
                </div>
                <div className="flex justify-between items-center transition-all duration-500">
                  <DateInput date={dateFrom} setDate={setDateFrom} />
                  <DateInput date={dateTo} setDate={setDateTo} />
                </div>
                <div className="px-2 flex items-center">
                  {flights && flights.length !== 0 && (
                    <div className="">
                      <div className="max-w-max">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className={`w-12 h-12 rounded-full ${
                            filteredFlights.length === selectedFlights.length
                              ? "bg-teal-600 dark:bg-teal-500"
                              : "text-slate-300 dark:text-slate-700 group-hover:bg-transparent group-hover:text-slate-200 dark:group-hover:text-slate-900"
                          } dark:border-teal-500 group`}
                        >
                          <i className="fas fa-plane-circle-check group-hover:text-teal-600"></i>
                        </button>

                        <label htmlFor="airportFilter" className="mx-4">
                          Filter by airport:
                        </label>
                        <select
                          id="airportFilter"
                          className="appearance-none bg-transparent"
                          onChange={(e) => setSelectdedDestination(e.target.value)}
                        >
                          <option value={""}>--All airports-- </option>
                          {destinations &&
                            destinations.map((destination: string) => (
                              <option key={destination} value={destination}>
                                {destination}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                {flights && flights.length > 0 && (
                  <ul className="ml-3">
                    {filteredFlights.map((flight: Flight, index: number) => (
                      <li
                        key={flight.id}
                        onPointerDown={(e) => handleSelect(e, index)}
                        className="flex items-center hover:bg-teal-400 dark:hover:bg-teal-700 cursor-pointer rounded-full px-2 max-w-max group"
                      >
                        <i
                          className={`fas fa-plane mr-2 ${
                            selectedFlights.includes(index)
                              ? "text-teal-600 dark:text-teal-500"
                              : "text-slate-300 dark:text-slate-700 group-hover:bg-transparent group-hover:text-slate-200 dark:group-hover:text-slate-900"
                          }`}
                        />

                        <span>{flight.date + "___"}</span>
                        <span>{flight.flight + "___"}</span>
                        <span>{flight.to}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-2 w-2/4 justify-center">
                <h1 className="w-full text-center">Loading Schema</h1>
                <SupplyDiagram supplierId={contracts[0].supplier} />
              </div>

              <div className="justify-center w-1/4 flex">Order</div>
            </div>
          )}
          {!contracts[0].signed_at && <div>{`The contract with ${contracts[0].name} is pending...`}</div>}
        </div>
      )}
      {!contracts || (contracts.length === 0 && <SupplierSelector />)}
    </div>
  )
}
