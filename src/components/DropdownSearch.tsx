import { Dispatch, SetStateAction, KeyboardEvent } from "react"
import { ActionCreatorWithPayload } from "@reduxjs/toolkit"

interface DropdownProps {
  items: any[]
  setOpen: Dispatch<SetStateAction<boolean>>
  selector: ActionCreatorWithPayload<any, string>
  dataView: string[]
  setSearch?: Dispatch<SetStateAction<any>>
}

export default function Dropdown({ items, setOpen, selector, dataView, setSearch }: DropdownProps) {
  const selectionHandler = (item: any) => {
    setOpen((prev) => !prev)
    selector(item)
    if (setSearch) setSearch(item)
  }

  return (
    <div className="absolute z-10 left-4 right-4 rounded-b-md max-h-80 overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-100 dark:bg-slate-800">
      <ul className="list-none w-full ">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between px-3 py-2 text-lg hover:bg-teal-600 hover:text-slate-200 cursor-pointer transition-colors"
            onClick={() => selectionHandler(item)}
          >
            {dataView.map((i) => (
              <span key={i}>{item[i]}</span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
