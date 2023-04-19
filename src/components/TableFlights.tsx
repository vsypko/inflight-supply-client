import { Dispatch, SetStateAction, useState, MouseEvent, useRef, RefObject, MutableRefObject } from "react"
import { IFlight } from "../types/airline.types"

export default function TableFlights({
  flights,
  setFlights,
  handleEditFlight,
}: {
  flights: IFlight[]
  setFlights?: Dispatch<SetStateAction<IFlight[]>>
  handleEditFlight?: (row: IFlight) => void
}): JSX.Element {
  const headers = Object.keys(flights[0]).slice(!setFlights ? 0 : 1) as Array<keyof IFlight>

  return (
    <div className="rounded-md max-h-[500px] md:max-h-[700px] max-w-max overflow-auto shadow-md dark:shadow-slate-600">
      <table className="text-left">
        <thead className="sticky top-0 text-lg dark:bg-slate-600 bg-slate-300 z-10">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 capitalize">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-md">
          {flights.map((row, index) => (
            <tr
              key={index}
              className="hover:dark:bg-teal-800 hover:bg-teal-400 cursor-pointer odd:bg-slate-100 odd:dark:bg-slate-800"
              onClick={() => {
                handleEditFlight ? handleEditFlight(row) : null
              }}
            >
              {headers.map((header) => (
                <td key={header} className="px-6">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
