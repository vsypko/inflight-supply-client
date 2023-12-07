import { useEffect, useState } from "react"
import { useLazyAirportScheduleQuery } from "../store/airport/airport.api"
import { Schedule } from "../types/company.types"
import ScheduleChart from "./ScheduleChart"
import PlaneModel from "./PlaneModel"
import { useAirport } from "../hooks/useAirport"
import DateInput from "./DateInput"

export default function AirportSchedule() {
  const [from, setFrom] = useState<Schedule[] | undefined>([])
  const [to, setTo] = useState<Schedule[] | undefined>([])

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const { airport } = useAirport()
  const [getSchedule, { data, error, isLoading }] = useLazyAirportScheduleQuery()

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
          <DateInput date={date} setDate={setDate} />
          <div className="w-full pl-2 rounded-md">
            {from?.length != 0 && <ScheduleChart headers={["departure", "destination", "flight"]} schedule={from} />}
            {to?.length != 0 && <ScheduleChart headers={["arrival", "destination", "flight"]} schedule={to} />}
          </div>
        </div>
      )}
    </>
  )
}
