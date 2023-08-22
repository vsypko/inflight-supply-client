import { ISchedule } from "../types/company.types"

export default function ScheduleChart({
  headers,
  schedule,
}: {
  headers: Array<keyof ISchedule>
  schedule: ISchedule[]
}) {
  return (
    <div className="flex rounded-md w-full max-h-[432px] overflow-scroll my-4">
      <table className="text-center table-auto w-full">
        <thead className="sticky top-0 text-lg dark:bg-slate-600 bg-slate-300 z-10 h-12">
          <tr>
            {headers.map((header) => (
              <th key={header} className="capitalize">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="h-12">
          {schedule.map((row, index) => (
            <tr key={index} className="odd:bg-slate-100 odd:dark:bg-slate-800 h-12">
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
