import { IAirport } from "../types/airport.types"
import { useActions } from "../hooks/actions"
import { Dispatch, SetStateAction } from "react"

interface DropdownProps<T> {
  items: T[] | undefined
  setSelected: Dispatch<SetStateAction<string>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Dropdown({ items, setSelected, setOpen }: DropdownProps<IAirport>) {
  const { selectAirport } = useActions()

  const selectionHandler = (item: IAirport) => {
    setSelected(item.ap_name)
    selectAirport(item)
    setOpen((prev) => !prev)
  }

  return (
    <div className="absolute z-10 left-4 right-4 rounded-b-md max-h-80 overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-100 dark:bg-slate-800">
      <ul className="list-none">
        {items?.map((item) => (
          <li
            key={item.ap_id}
            className="flex justify-between px-3 py-2 text-lg hover:bg-teal-600 hover:text-slate-200 cursor-pointer transition-colors"
            onClick={() => selectionHandler(item)}
          >
            <span>{item.ap_name}</span>
            <span>{item.ap_iata_code}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
