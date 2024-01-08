import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { Flight } from "../types/company.types"

import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery } from "../store/contracts/contract.api"
import SupplierSelector from "../components/SupplierSelector"
import { PointerEvent, useEffect, useState } from "react"
import DateInput from "../components/DateInput"
import { useGetFlightsQuery } from "../store/orders/orders.api"
import { ctrlSelection, selectAll, shiftSelection } from "../services/flights.selector"
import SupplyDiagram from "../components/SupplyDiagram"
import Orders from "../components/Orders"

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
      <div
        className={`${
          airport.name ? "uppercase" : "normal-case"
        }  font-semibold text-amber-600 flex justify-between mx-6`}
      >
        {airport.name
          ? airport.name + " - " + airport.iata
          : "AIRPORT NOT SELECTED: Select an airport on the AIRPORTS tab"}
        {contracts && contracts[0].signed_at && (
          <div className="text-teal-600 normal-case">
            {`The contract with ${contracts[0].name} is in force from 
                      ${new Date(contracts[0].signed_at).toDateString()} 
                    `}
          </div>
        )}
      </div>

      {contracts && contracts.length > 0 && (
        <div className="">
          {contracts[0].signed_at && (
            <div className="w-full">
              <div className="w-full md:flex">
                <div className="w-full md:w-1/4">
                  <div className="flex w-full justify-between items-center transition-all duration-500 text-base">
                    <DateInput date={dateFrom} setDate={setDateFrom} />
                    <DateInput date={dateTo} setDate={setDateTo} />
                  </div>

                  {flights && flights.length !== 0 && (
                    <div className="flex w-full justify-between my-2">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className={`w-6 h-6 rounded-full ${
                          filteredFlights.length === selectedFlights.length
                            ? "text-teal-600 dark:text-teal-500"
                            : "text-slate-400 dark:text-slate-600 hover:text-teal-600 dark:hover:text-teal-500"
                        }`}
                      >
                        <i className="fas fa-plane-circle-check"></i>
                      </button>

                      <select
                        id="airportFilter"
                        className="rounded-full cursor-pointer bg-slate-300 dark:bg-slate-800 px-2 text-base"
                        onChange={(e) => setSelectdedDestination(e.target.value)}
                      >
                        <option value={""}>all airports</option>
                        {destinations &&
                          destinations.map((destination: string) => (
                            <option key={destination} value={destination}>
                              {destination}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {flights && flights.length > 0 && (
                    <ul className="text-base space-y-1 max-h-[644px] overflow-y-auto snap-y">
                      {filteredFlights.map((flight: Flight, index: number) => (
                        <li
                          key={flight.id}
                          onPointerDown={(e) => handleSelect(e, index)}
                          className={`grid grid-cols-10 gap-1 snap-start hover:bg-teal-500 dark:hover:bg-teal-700 cursor-pointer rounded-full group ${
                            selectedFlights.includes(index) && "bg-slate-300 dark:bg-slate-800"
                          }`}
                        >
                          <i
                            className={`grid items-center fas fa-plane col-span-1 place-items-center ${
                              selectedFlights.includes(index)
                                ? "text-teal-600 dark:text-teal-500"
                                : "text-slate-400 dark:text-slate-600 group-hover:bg-transparent group-hover:text-slate-200 dark:group-hover:text-slate-900"
                            }`}
                          />

                          <span className="grid col-span-3 place-items-center">{flight.date}</span>
                          <span className="grid col-span-2">{flight.std}</span>
                          <span className="grid col-span-2 place-items-center">{flight.flight}</span>
                          <span className="grid col-span-2 place-items-center">{flight.to}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="w-full md:w-1/2 justify-center">
                  <h1 className="w-full text-center">Loading Schema</h1>
                  <SupplyDiagram supplierId={contracts[0].supplier} />
                </div>

                {selectedFlights.length === 1 && (
                  <div className="w-full md:w-1/4 flex flex-col items-center text-base">
                    <Orders order={{ leg: filteredFlights[selectedFlights[0]] }} />
                  </div>
                )}
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
