import { ChangeEvent, Dispatch, SetStateAction, MouseEvent } from 'react'
import { Item } from '../types/company.types'

interface IOrderedItem {
  item: Item
  quantity: number
  percent: number
  section: string
}
export default function OrderedItem({
  selectedSection,
  selectedItem,
  setSelectedItem,
  orderedItems,
  setOrderedItems,
  selectedOrderedItem,
  setSelectedOrderedItem,
}: {
  selectedSection: string
  selectedItem: Item
  setSelectedItem: Dispatch<SetStateAction<Item | undefined>>
  orderedItems: IOrderedItem[]
  setOrderedItems: Dispatch<React.SetStateAction<IOrderedItem[]>>
  selectedOrderedItem: IOrderedItem | undefined
  setSelectedOrderedItem: Dispatch<SetStateAction<IOrderedItem | undefined>>
}) {
  function onFocus(element: HTMLInputElement | null, selected: boolean) {
    if (element && selected) {
      element.focus()
      element.value =
        element.valueAsNumber === 0 ? '' : element.valueAsNumber.toString()
    }
  }

  function handleSelectionOrderedItem(
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
    supplyItem: IOrderedItem
  ) {
    setSelectedItem(supplyItem.item)
    setSelectedOrderedItem(supplyItem)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const items = [...orderedItems]
    items[index] = {
      ...items[index],
      [event.target.name]: event.target.valueAsNumber,
    }
    setOrderedItems(items)
  }

  return (
    <ul className="">
      {orderedItems.map((orderedItem: IOrderedItem, index) => (
        <li
          key={index}
          onClick={(e) => handleSelectionOrderedItem(e, orderedItem)}
          className={`w-full items-center group grid grid-cols-12 gap-1 cursor-pointer rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 ${
            selectedItem.id === orderedItem.item.id &&
            'bg-slate-300 dark:bg-slate-800'
          } ${selectedSection !== orderedItem.section && 'hidden'}`}
        >
          <img
            src={
              import.meta.env.VITE_API_URL +
              'company/items/img/' +
              orderedItem.item?.img_url
            }
            alt="No image to show"
            className="rounded-full col-span-1"
          />
          <span className="col-span-1 text-center">
            {orderedItem.item?.code}
          </span>
          <span className="col-span-5">{orderedItem.item?.title}</span>
          <input
            ref={(element) =>
              onFocus(element, selectedItem.id === orderedItem.item.id)
            }
            type="number"
            name="percent"
            value={orderedItem.percent}
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />
          <input
            type="number"
            name="quantity"
            value={orderedItem.quantity}
            placeholder=" "
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />

          <button
            onClick={() =>
              setOrderedItems(
                orderedItems.filter(
                  (item) => item.item.id !== orderedItem.item.id
                )
              )
            }
            className={`w-full h-full col-span-1 rounded-full opacity-60 active:scale-90 hover:opacity-100 hover:bg-slate-600 group-hover:visible ${
              selectedItem === orderedItem.item ? 'visible' : 'invisible'
            }`}
          >
            <i className="far fa-trash-can text-rose-600" />
          </button>
        </li>
      ))}
    </ul>
  )
}
