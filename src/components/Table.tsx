import { Dispatch, SetStateAction, useState, MouseEvent } from "react"

export default function Table<T>({
  headers,
  data,
  height = "max-h-[500px]",
  mdheight = "max-h-[700px]",
  handleEdit,
}: {
  headers: (keyof T)[]
  data: T[]
  height?: string
  mdheight?: string
  handleEdit?: (row: T) => void
}): JSX.Element {
  const [selected, setSelected] = useState<number>(-1)

  const handleClick = (e: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>, row: T, index: number) => {
    if (handleEdit) handleEdit(row)
    setSelected(index)
  }

  return (
    <div className={`rounded-md ${height} ${mdheight} max-w-max shadow-md overflow-auto dark:shadow-slate-600`}>
      <table className="text-left table-auto">
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
              className={`cursor-pointer hover:bg-teal-300 hover:dark:bg-teal-800 ${
                index === selected ? "bg-teal-300 dark:bg-teal-800" : "odd:bg-slate-100 odd:dark:bg-slate-800"
              }`}
              onClick={(e) => handleClick(e, row, index)}
            >
              {headers.map((header) => (
                <td key={header as string} className="px-6 truncate max-w-md">
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
