import { useEffect, useState, PointerEvent } from 'react'
import { useAirport } from '../hooks/useAirport'
import { useCompany } from '../hooks/useCompany'
import { FlightSelected } from '../types/company.types'
import { useOrder } from '../hooks/useOrder'
import { useActions } from '../hooks/actions'
import {
  useGetFlightsQuery,
  useLazyGetOrderQuery,
} from '../store/orders/orders.api'
import DateInput from './DateInput'
import { selector } from '../services/select.flights'

export default function FlightsSelector() {
  const { airport } = useAirport()
  const { company } = useCompany()
  const { selectedFlights } = useOrder()
  const { setOrderItems, setSelectedFlights } = useActions()

  const [dateFrom, setDateFrom] = useState<Date | null>(new Date())
  const [dateTo, setDateTo] = useState<Date | null>(new Date())
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedDestination, setSelectdedDestination] = useState('')

  const { data: flights } = useGetFlightsQuery(
    {
      airport: airport.iata,
      company: company.id,
      datefrom: dateFrom!.toISOString().slice(0, 10),
      dateto: dateTo!.toISOString().slice(0, 10),
    },
    { refetchOnFocus: true }
  )
  const [getOrder] = useLazyGetOrderQuery()

  async function handleSelect(
    e: PointerEvent<HTMLLIElement>,
    flight: FlightSelected
  ) {
    e.preventDefault()
    let selected = [...selectedFlights]
    let filtered = [...flights]

    if (selectedDestination) {
      filtered = filtered.filter((fltr) => fltr.to === selectedDestination)
    }

    selected = selector(filtered, selected, flight, e)
    setSelectedFlights(selected)
    let ordered = selected.filter((slct) => slct.ordered)
    if (ordered.length === 1) {
      const items = await getOrder({ id: ordered[0].id }).unwrap()
      setOrderItems(items.data)
    } else {
      setOrderItems([])
    }
  }

  //----- All flight selection handler ----------------------------------
  function handleSelectAll() {
    let selected = [...selectedFlights]
    let filtered = [...flights]
    if (selectedDestination)
      filtered = filtered.filter((fltr) => fltr.to === selectedDestination)
    selected = selector(filtered, selected)
    if (selected.length) setOrderItems([])
    setSelectedFlights(selected)
  }

  useEffect(() => {
    if (flights && flights.length)
      setDestinations([
        ...new Set(
          flights.map((fl: FlightSelected) => fl.to).sort() as string[]
        ),
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
              className={`w-6 h-6 rounded-full group ${
                flights.length === selectedFlights.length
                  ? 'text-teal-600 dark:text-teal-500'
                  : 'text-slate-400 dark:text-slate-600 hover:text-teal-600 dark:hover:text-teal-500'
              }`}
            >
              <i className="fas fa-plane-circle-check group-active:scale-90 text-lg drop-shadow-[0_2px_2px_rgba(71,85,105,0.9)] group-active:drop-shadow-none"></i>
            </button>

            <select
              id="airportFilter"
              className="rounded-full cursor-pointer bg-slate-300 dark:bg-slate-800 px-2 text-base opacity-80 hover:opacity-100 active:scale-90 shadow-sm shadow-slate-600 active:shadow-none transition-all"
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
          <ul className="space-y-1 max-h-[364px] md:max-h-[644px] overflow-y-auto snap-y font-light">
            {flights.map((flight: FlightSelected, index: number) => (
              <li
                key={flight.id}
                onPointerDown={(e) => handleSelect(e, flight)}
                className={`text-xs md:text-base ${
                  (selectedDestination && flight.to === selectedDestination) ||
                  !selectedDestination
                    ? 'grid'
                    : 'hidden'
                } grid-cols-12 gap-1 snap-start hover:bg-teal-400 dark:hover:bg-teal-800 cursor-pointer rounded-full group ${
                  selectedFlights.some((f) => f.id === flight.id) &&
                  'bg-gradient-to-r from-slate-400 dark:from-slate-700 to-slate-50 dark:to-slate-950'
                }
                ${
                  new Date(flight.date + 'T' + flight.std).getTime() -
                    new Date().getTime() >
                  24 * 60 * 60 * 1000
                    ? 'text-lime-700 dark:text-lime-300'
                    : new Date(flight.date + 'T' + flight.std).getTime() -
                        new Date().getTime() >
                      0
                    ? 'text-yellow-600'
                    : 'text-orange-600'
                }`}
              >
                <i
                  className={`grid items-center fas col-span-1 place-items-start p-1 ${
                    selectedFlights.some((f) => f.id === flight.id) &&
                    !flight.ordered
                      ? 'fa-plane-up text-teal-300 dark:text-teal-600'
                      : `${
                          !flight.ordered
                            ? 'fa-plane-up  text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-900'
                            : 'fa-plane text-sky-400 dark:text-sky-600'
                        }`
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
