import { Schedule } from "../types/company.types"

export default function ScheduleChart({ headers, schedule }: { headers: string[]; schedule: Schedule[] | undefined }) {
  return (
    <div className="flex rounded-xl w-full max-h-[336px] overflow-scroll my-4 mb-16">
      <table className="table-fixed w-full tracking-widest">
        <thead className="text-lg z-10 h-12">
          <tr>
            {headers.map((header) => (
              <th key={header} className="capitalize sticky top-0 bg-slate-300 dark:bg-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="h-12 mt-12 text-center">
          {schedule?.map((row, index) => (
            <tr
              key={index}
              className="odd:bg-slate-100 odd:dark:bg-slate-800 h-12 even:bg-slate-200 even:dark:bg-slate-900"
            >
              {headers.map((header) => (
                <td key={header} className="text-slate-600 dark:text-slate-300">
                  {row[header as keyof Schedule]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
