import { useEffect, useState, PointerEvent } from 'react'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { FlightSelected } from '../types/company.types'
import { useOrder } from '../hooks/useOrder'
import { useActions } from '../hooks/actions'
import { useGetFlightsQuery } from '../store/orders/orders.api'
import DateInput from './DateInput'

export default function FlightsSelector() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { selectedFlights } = useOrder()
  const { setSelectedFlights } = useActions()

  const [dateFrom, setDateFrom] = useState<Date | null>(new Date())
  const [dateTo, setDateTo] = useState<Date | null>(new Date())
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedDestination, setSelectdedDestination] = useState('')

  const { data: flights } = useGetFlightsQuery({
    airport: airport.iata,
    company: company.id,
    datefrom: dateFrom!.toISOString().slice(0, 10),
    dateto: dateTo!.toISOString().slice(0, 10),
  })

  function handleSelect(
    e: PointerEvent<HTMLLIElement>,
    flight: FlightSelected
  ) {
    e.preventDefault()

    let selected = [...selectedFlights]
    if (e.ctrlKey) {
      if (selected.some((selectedItem) => selectedItem.id === flight.id)) {
        selected = selected.filter(
          (selectedItem) => selectedItem.id !== flight.id
        )
      } else {
        selected.push(flight)
      }
      setSelectedFlights(selected)
      return
    }
    setSelectedFlights([flight])
  }

  function handleSelectAll() {
    if (flights && selectedDestination) {
      const filtered = flights.filter(
        (fl: FlightSelected) => fl.to === selectedDestination
      )
      let selected = [...selectedFlights]

      const selectedInFiltered: FlightSelected[] = filtered.filter(
        (filteredItem: FlightSelected) =>
          selected.some(
            (selectedItem: FlightSelected) =>
              selectedItem.id === filteredItem.id
          )
      )

      if (
        !selectedInFiltered.length ||
        filtered.length !== selectedInFiltered.length
      ) {
        filtered.forEach((filteredItem: FlightSelected) => {
          if (
            !selected.length ||
            selected.some(
              (selectedItem: FlightSelected) =>
                selectedItem.id !== filteredItem.id
            )
          )
            selected.push(filteredItem)
        })
        setSelectedFlights(selected)
        return
      }

      selected = selected.filter(
        (selectedItem: FlightSelected) =>
          !filtered.some(
            (filteredItem: FlightSelected) =>
              filteredItem.id === selectedItem.id
          )
      )
      setSelectedFlights(selected)
      return
    }

    if (flights && flights.length !== selectedFlights.length) {
      setSelectedFlights(flights)
      return
    }

    setSelectedFlights([])
  }

  useEffect(() => {
    if (flights && flights.length)
      setDestinations([
        ...new Set(flights.map((fl: FlightSelected) => fl.to) as string[]),
      ])
  }, [flights])

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center text-base">
        <DateInput date={dateFrom} setDate={setDateFrom} />
        <DateInput date={dateTo} setDate={setDateTo} />
      </div>
      {flights && flights.length > 0 && (
        <>
          <div className="w-full flex justify-between my-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`w-6 h-6 rounded-full ${
                flights.length === selectedFlights.length
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
          <ul className="text-base space-y-1 max-h-[644px] overflow-y-auto snap-y">
            {flights.map((flight: FlightSelected, index: number) => (
              <li
                key={flight.id}
                onPointerDown={(e) => handleSelect(e, flight)}
                className={`${
                  (selectedDestination && flight.to === selectedDestination) ||
                  !selectedDestination
                    ? 'grid'
                    : 'hidden'
                } grid-cols-12 gap-1 snap-start hover:bg-teal-500 dark:hover:bg-teal-700 cursor-pointer rounded-full group ${
                  selectedFlights.some((f) => f.id === flight.id) &&
                  'bg-gradient-to-r from-slate-100 dark:from-slate-950 to-slate-300 dark:to-slate-800'
                }`}
              >
                <i
                  className={`grid items-center fas fa-plane col-span-1 place-items-start pl-1 ${
                    selectedFlights.some((f) => f.id === flight.id)
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
                <span className="grid col-span-1 place-items-start">
                  {flight.flight}
                </span>
                <span className="grid col-span-2 place-items-center">
                  {flight.reg}
                </span>
                <span className="grid col-span-1 place-items-center">
                  {flight.type}
                </span>
                <span className="grid col-span-2 place-items-center">
                  {flight.to}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
