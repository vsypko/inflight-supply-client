import { IAirport } from "../types/airport.types"
import { useActions } from "../hooks/actions"
import { Dispatch, SetStateAction } from "react"

interface DropdownProps<T> {
  items: T[] | undefined
  setSelected: Dispatch<SetStateAction<string>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Dropdown({ items, setSelected, setOpen }: DropdownProps<IAirport>): JSX.Element {
  const { selectAirport } = useActions()
  const selectionHandler = (item: IAirport) => {
    setSelected(item.ap_name)
    selectAirport(item)
    setOpen((prev) => !prev)
  }

  return (
    <div className="mx-3 rounded-b-md max-h-80 overflow-y-scroll shadow-md dark:shadow-slate-600">
      <ul className="list-none">
        {items?.map((item) => (
          <li
            key={item.ap_id}
            className="flex justify-between px-3 py-2 text-lg hover:bg-slate-600 hover:text-slate-300 cursor-pointer transition-colors"
            onClick={() => selectionHandler(item)}
          >
            <p>{item.ap_name}</p>
            <p>{item.ap_iata_code}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
