import { Dispatch, SetStateAction } from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

interface DropdownProps {
  items: any[] | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  selector:
    | ActionCreatorWithPayload<any, string>
    | Dispatch<React.SetStateAction<any>>
  dataView: string[]
}

export default function SearchDropdown({
  items,
  setOpen,
  selector,
  dataView,
}: DropdownProps) {
  const selectionHandler = (item: any) => {
    setOpen((prev) => !prev)
    selector(item)
  }

  return (
    <ul className="list-none w-full bg-slate-300 dark:bg-slate-800 text-xl md:text-lg">
      {items &&
        items.map((item) => (
          <li
            key={item.id}
            className="flex snap-start justify-between px-6 py-2 rounded-full text-lg hover:bg-teal-600 hover:text-slate-200 cursor-pointer transition-colors"
            onClick={() => selectionHandler(item)}
          >
            {dataView.map((i) => (
              <span key={i}>{item[i]}</span>
            ))}
          </li>
        ))}
    </ul>
  )
}
