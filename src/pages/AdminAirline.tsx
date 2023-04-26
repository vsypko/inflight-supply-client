import { ChangeEvent, useEffect, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import FlightsEditor from "../components/FlightsEditor"
import FleetEditor from "../components/FleetEditor"

export default function AdminAirline() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, company } = useAuth()
  const [action, setAction] = useState("fleet")

  return (
    <div className="w-full">
      <div className="block md:flex p-2 m-1 max-h-max">
        <div className="w-full md:w-1/4 md:text-2xl">
          <div className="flex justify-between m-3">
            <h1>Company:</h1>
            <span className="font-bold">{company?.co_name}</span>
          </div>
          <div className="flex justify-between m-3">
            <h1>Country:</h1>
            <div className="flex">
              <span className="font-bold mr-2">{company?.co_cn_name}</span>
              <img src={`data:image/png;base64, ${company?.co_cn_flag}`} alt="" className="py-1" />
            </div>
          </div>
          <div className="flex justify-between m-3">
            <h1>IATA code:</h1>
            <span className="font-bold">{company?.co_iata_code}</span>
          </div>

          <div className="flex md:flex-col mt-4 justify-around md:space-y-10">
            <div className={`transition-all ${action === "fleet" ? "md:ml-4" : ""}`}>
              <button
                onClick={() => setAction("fleet")}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === "fleet" ? "opacity-100" : "opacity-50"
                }`}
              >
                <i className="fas fa-plane-circle-check text-2xl py-2.5 px-3 rounded-full bg-orange-500 mr-2" />
                <h1 className="p-1 font-semibold">Fleet</h1>
              </button>
            </div>
            <div className={`transition-all ${action === "flights" ? "md:ml-4" : ""}`}>
              <button
                onClick={() => setAction("flights")}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === "flights" ? "opacity-100" : "opacity-50"
                }`}
              >
                <i className="far fa-calendar-days text-2xl py-2.5 px-4 rounded-full bg-lime-600 mr-2" />
                <h1 className="p-1 font-semibold">Schedule</h1>
              </button>
            </div>
            <div className={`transition-all ${action === "staff" ? "md:ml-4" : ""}`}>
              <button
                onClick={() => setAction("staff")}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === "staff" ? "opacity-100" : "opacity-50"
                }`}
              >
                <i className="fas fa-user-group text-2xl py-2.5 px-3  rounded-full bg-sky-700 mr-2" />
                <h1 className="p-1 font-semibold">Users</h1>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:flex justify-center">
          {action === "fleet" && <FleetEditor />}
          {action === "flights" && <FlightsEditor />}
        </div>
      </div>
    </div>
  )
}
