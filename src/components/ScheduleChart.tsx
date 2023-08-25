import { ISchedule } from "../types/company.types"

export default function ScheduleChart({
  headers,
  schedule,
}: {
  headers: Array<keyof ISchedule>
  schedule: ISchedule[]
}) {
  return (
    <div className="flex rounded-md w-full max-h-[336px] overflow-scroll my-4 mb-16">
      <table className="text-center table-auto w-full tracking-widest">
        <thead className="text-lg z-10 h-12">
          <tr>
            {headers.map((header) => (
              <th key={header} className="capitalize sticky top-0 bg-slate-300 dark:bg-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="h-12 mt-12">
          {schedule.map((row, index) => (
            <tr key={index} className="odd:bg-slate-100 odd:dark:bg-slate-800 h-12 ">
              {headers.map((header) => (
                <td key={header} className="text-slate-500">
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
