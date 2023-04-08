import { IFlightRow } from "../types/airline.types"

export default function Table({ schedule }: { schedule: any[] }): JSX.Element {
  // const headers = ["date", "flight", "acType", "acReg", "from", "to", "std", "sta", "seats"]
  const headers = Object.keys(schedule[0] || {})

  // function timeConverter(time: number): string {
  //   const convertedTime = new Date(time * 24 * 60 * 60 * 1000)
  //   const hours =
  //     convertedTime.getUTCHours() < 10
  //       ? "0" + convertedTime.getUTCHours().toString()
  //       : convertedTime.getUTCHours().toString()
  //   const minutes =
  //     convertedTime.getUTCMinutes() < 10
  //       ? "0" + convertedTime.getUTCMinutes().toString()
  //       : convertedTime.getUTCMinutes().toString()
  //   return hours + ":" + minutes
  // }

  return (
    <div className="rounded-md ml-3 max-h-80 max-w-max overflow-y-auto scroll-smooth shadow-md dark:shadow-slate-600">
      <table className="text-left">
        <thead className="sticky top-0 text-sm dark:bg-slate-600 bg-slate-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="pl-2 pr-4 capitalize">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs">
          {schedule.map((row, index) => {
            return (
              <tr
                key={index}
                className={`hover:dark:bg-teal-800 hover:bg-teal-400 cursor-pointer ${
                  index & 1 ? "bg-slate-100 dark:bg-slate-800" : ""
                }`}
              >
                {headers.map((header) => (
                  <td key={header} className="pl-2 pr-4">
                    {row[header]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
