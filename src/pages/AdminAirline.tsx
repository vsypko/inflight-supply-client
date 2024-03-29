import { useState } from 'react'
import { useAppSelector } from '../hooks/redux'
import { useAuth } from '../hooks/useAuth'
import FlightsEditor from '../components/FlightsEditor'
import FleetEditor from '../components/FleetEditor'
import { useCompany } from '../hooks/useCompany'

export default function AdminAirline() {
  const { company } = useCompany()
  const [action, setAction] = useState('fleet')

  return (
    <div className="w-full">
      <div className="md:flex p-2 max-h-max">
        <div className="w-full md:w-1/4 md:text-2xl">
          <div className="flex justify-between p-2">
            <div>Company:</div>
            <div className="font-bold">{company.name}</div>
          </div>
          <div className="flex w-full p-2">
            <div>Country:</div>
            <div className="flex w-full justify-end">
              <span className="font-bold mr-3">{company.country}</span>
              <img
                src={`data:image/png;base64, ${company.flag}`}
                alt=""
                className="py-1"
              />
            </div>
          </div>
          <div className="flex justify-between p-2">
            <h1>IATA code:</h1>
            <span className="font-bold">{company.iata}</span>
          </div>

          <div className="flex md:flex-col mt-4 justify-around md:space-y-10">
            <div
              className={`transition-all ${
                action === 'fleet' ? 'md:ml-4' : ''
              }`}
            >
              <button
                onClick={() => setAction('fleet')}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === 'fleet' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-orange-500 items-center flex justify-center text-3xl">
                  <i className="fas fa-plane-circle-check" />
                </div>

                <h1 className="p-1 font-semibold">Fleet</h1>
              </button>
            </div>
            <div
              className={`transition-all ${
                action === 'flights' ? 'md:ml-4' : ''
              }`}
            >
              <button
                onClick={() => setAction('flights')}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === 'flights' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-lime-600 items-center flex justify-center text-3xl">
                  <i className="far fa-calendar-days" />
                </div>

                <h1 className="p-1 font-semibold">Flights</h1>
              </button>
            </div>
            <div
              className={`transition-all ${
                action === 'staff' ? 'md:ml-4' : ''
              }`}
            >
              <button
                onClick={() => setAction('staff')}
                className={`block md:flex items-center hover:opacity-100 active:scale-90 ${
                  action === 'staff' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-sky-700 items-center flex justify-center text-3xl">
                  <i className="fas fa-user-group" />
                </div>

                <h1 className="p-1 font-semibold">Users</h1>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:flex justify-center">
          {action === 'fleet' && <FleetEditor />}
          {action === 'flights' && <FlightsEditor />}
        </div>
      </div>
    </div>
  )
}
