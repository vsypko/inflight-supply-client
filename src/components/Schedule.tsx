import { useEffect, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { useLazyAirportScheduleQuery } from "../store/airport/airport.api"
import { ISchedule } from "../types/company.types"
import ScheduleChart from "./ScheduleChart"
import PlaneModel from "./PlaneModel"

export default function Schedule() {
  const [from, setFrom] = useState<ISchedule[] | undefined>([])
  const [to, setTo] = useState<ISchedule[] | undefined>([])

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const { selected } = useAppSelector((state) => state.airport)
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
    if (selected) {
      getSchedule({ airport: selected.ap_iata_code, date }).unwrap()
      if (data?.scheduleFrom) setFrom(data?.scheduleFrom)
      if (data?.scheduleTo) setTo(data?.scheduleTo)
    }
  }, [selected, data, date])

  return (
    <>
      {from?.length === 0 && to?.length === 0 && <PlaneModel />}
      {(from?.length != 0 || to?.length != 0) && !isLoading && (
        <div className="w-full md:w-2/3 flex flex-col mt-2 md:px-10">
          <div className="flex mb-2 lg:mb-1 text-xl justify-center">
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
            {/* <h1 className="tracking-widest font-bold font-">DEPARTURE</h1> */}
            <ScheduleChart headers={Object.keys(from![0]) as Array<keyof ISchedule>} schedule={from!} />
            {/* <h1 className="tracking-widest font-bold font-">ARRIVAL</h1> */}
            <ScheduleChart headers={Object.keys(to![0]) as Array<keyof ISchedule>} schedule={to!} />
          </div>
        </div>
      )}
    </>
  )
}
