import { useState, PointerEvent, useEffect } from 'react'
import { useGetFlightsQuery } from '../store/orders/orders.api'
import { useAirport } from '../hooks/useAirport'
import { useCompany } from '../hooks/useCompany'
import DateInput from './DateInput'
import { Flight } from '../types/company.types'
import { useAuth } from '../hooks/useAuth'
import {
  ctrlSelection,
  selectAll,
  shiftSelection,
} from '../services/flights.selector'

export default function FlightsSelector() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()

  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10))
  const [selectedFlights, setSelectedFlights] = useState<number[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedDestination, setSelectdedDestination] = useState('')
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])

  const { data: flights } = useGetFlightsQuery(
    {
      airport: airport.iata,
      company: company.id,
      datefrom: dateFrom,
      dateto: dateTo,
    },
    { refetchOnFocus: true }
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
    if (selectedDestination)
      setFilteredFlights(
        flights.filter((flight: Flight) => flight.to === selectedDestination)
      )
    setSelectedFlights([])
  }, [flights, selectedDestination])

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center text-base">
        <DateInput date={dateFrom} setDate={setDateFrom} />
        <DateInput date={dateTo} setDate={setDateTo} />
      </div>
      {flights && flights.length > 0 && (
        <div className="flex w-full justify-between my-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className={`w-6 h-6 rounded-full ${
              filteredFlights.length === selectedFlights.length
                ? 'text-teal-600 dark:text-teal-500'
                : 'text-slate-400 dark:text-slate-600 hover:text-teal-600 dark:hover:text-teal-500'
            }`}
          >
            <i className="fas fa-plane-circle-check"></i>
          </button>

          <select
            id="airportFilter"
            className="rounded-full cursor-pointer bg-slate-300 dark:bg-slate-800 px-2 text-base"
            onChange={(e) => setSelectdedDestination(e.target.value)}
          >
            <option value={''}>all airports</option>
            {destinations &&
              destinations.map((destination: string) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
          </select>
        </div>
      )}
      <ul className="text-base space-y-1 max-h-[644px] overflow-y-auto snap-y">
        {filteredFlights.map((flight: Flight, index: number) => (
          <li
            key={flight.id}
            onPointerDown={(e) => handleSelect(e, index)}
            className={`grid grid-cols-10 gap-1 snap-start hover:bg-teal-500 dark:hover:bg-teal-700 cursor-pointer rounded-full group ${
              selectedFlights.includes(index) &&
              'bg-slate-300 dark:bg-slate-800'
            }`}
          >
            <i
              className={`grid items-center fas fa-plane col-span-1 place-items-start pl-1 ${
                selectedFlights.includes(index)
                  ? 'text-teal-600 dark:text-teal-500'
                  : 'text-slate-400 dark:text-slate-600 group-hover:bg-transparent group-hover:text-slate-200 dark:group-hover:text-slate-900'
              }`}
            />

            <span className="grid col-span-3 place-items-center">
              {flight.date}
            </span>
            <span className="grid col-span-2 place-items-start">
              {flight.std}
            </span>
            <span className="grid col-span-2 place-items-center">
              {flight.flight}
            </span>
            <span className="grid col-span-2 place-items-center">
              {flight.to}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
