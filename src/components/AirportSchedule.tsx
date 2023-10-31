import { useEffect, useState } from "react"
import { useLazyAirportScheduleQuery } from "../store/airport/airport.api"
import { Schedule } from "../types/company.types"
import ScheduleChart from "./ScheduleChart"
import PlaneModel from "./PlaneModel"
import { useAirport } from "../hooks/useAirport"

export default function AirportSchedule() {
  const [from, setFrom] = useState<Schedule[] | undefined>([])
  const [to, setTo] = useState<Schedule[] | undefined>([])

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const { airport } = useAirport()
  const [getSchedule, { data, error, isLoading }] = useLazyAirportScheduleQuery()

  function handleDecreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() - 0)
        .toISOString()
        .slice(0, 10),
    )
  }

  function handleIncreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() + 2)
        .toISOString()
        .slice(0, 10),
    )
  }

  useEffect(() => {
    setFrom([])
    setTo([])
    if (airport.iata) {
      getSchedule({ airport: airport.iata, date }).unwrap()
      if (data?.scheduleFrom) setFrom(data?.scheduleFrom)
      if (data?.scheduleTo) setTo(data?.scheduleTo)
    }
  }, [airport, data, date])

  return (
    <>
      {from?.length === 0 && to?.length === 0 && <PlaneModel />}
      {!isLoading && (
        <div className="w-full md:w-2/3 flex flex-col mt-2 md:px-10">
          <div className="flex mb-2 lg:mb-1 text-xl justify-center z-10">
            <button
              type="button"
              className="h-8 w-8 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
              onClick={handleDecreaseDate}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <label className="mx-2">
              <input
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent"
              />
            </label>
            <button
              type="button"
              className="h-8 w-8 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
              onClick={handleIncreaseDate}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>

          <div className="w-full pl-2 rounded-md">
            {from?.length != 0 && <ScheduleChart headers={["departure", "destination", "flight"]} schedule={from} />}
            {to?.length != 0 && <ScheduleChart headers={["arrival", "destination", "flight"]} schedule={to} />}
          </div>
        </div>
      )}
    </>
  )
}
