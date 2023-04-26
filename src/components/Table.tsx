import { Dispatch, SetStateAction } from "react"

export default function Table<T>({
  headers,
  data,
  setData,
  handleEdit,
}: {
  headers: (keyof T)[]
  data: T[]
  setData?: Dispatch<SetStateAction<T[]>>
  handleEdit?: (row: T) => void
}): JSX.Element {
  return (
    <div className="rounded-md max-h-[500px] md:max-h-[700px] max-w-max overflow-auto shadow-md dark:shadow-slate-600">
      <table className="text-left">
        <thead className="sticky top-0 text-lg dark:bg-slate-600 bg-slate-300 z-10">
          <tr>
            {headers.map((header) => (
              <th key={header as string} className="px-6 capitalize">
                {header as string}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-base">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:dark:bg-teal-800 hover:bg-teal-400 cursor-pointer odd:bg-slate-100 odd:dark:bg-slate-800"
              onClick={() => {
                handleEdit ? handleEdit(row) : null
              }}
            >
              {headers.map((header) => (
                <td key={header as string} className="px-6">
                  {row[header] as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
