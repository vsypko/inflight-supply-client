import { useState } from 'react'

export default function Chart<T>({
  headers,
  rows,
  height = 'max-h-[500px]',
  mdheight = 'md:max-h-[490px]',
  handleEdit,
}: {
  headers: string[]
  rows: T[]
  height?: string
  mdheight?: string
  handleEdit?: (row: T) => void
}): JSX.Element {
  const [selected, setSelected] = useState(-1)

  const handleClick = (row: T, index: number) => {
    if (handleEdit) handleEdit(row)
    setSelected(index)
  }

  return (
    <div className={`rounded-md ${height} ${mdheight} w-full shadow-md overflow-auto dark:shadow-slate-600`}>
      <table className="text-left table-auto">
        <thead className="sticky top-0 text-lg dark:bg-slate-600 bg-slate-300">
          <tr>
            {headers.map((header) => (
              <th
                key={header as string}
                className={`px-6 ${header.length < 4 && header !== 'to' ? 'uppercase' : 'capitalize'}`}
              >
                {header as string}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-base">
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`cursor-pointer hover:bg-teal-300 hover:dark:bg-teal-800 ${
                index === selected ? 'bg-teal-300 dark:bg-teal-800' : 'odd:bg-slate-100 odd:dark:bg-slate-800'
              }`}
              onClick={() => handleClick(row, index)}
            >
              {headers.map((header) => (
                <td key={header as string} className={`px-6 truncate max-w-md ${header === 'price' && 'text-right'}`}>
                  {header === 'price'
                    ? '$ ' + (row[header as keyof T] as number).toFixed(2)
                    : (row[header as keyof T] as string)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
