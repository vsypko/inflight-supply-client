import { ChangeEvent, Dispatch, SetStateAction, MouseEvent } from "react"
import { Item } from "../types/company.types"

interface ISupplyItem {
  item: Item
  quantity: number
  percent: number | undefined
  section: string
}
export default function SupplyItem({
  selectedSection,
  selectedItem,
  setSelectedItem,
  supplyItems,
  setSupplyItems,
  selectedSupplyItem,
  setSelectedSupplyItem,
}: {
  selectedSection: string
  selectedItem: Item
  setSelectedItem: Dispatch<SetStateAction<Item | undefined>>
  supplyItems: ISupplyItem[]
  setSupplyItems: Dispatch<React.SetStateAction<ISupplyItem[]>>
  selectedSupplyItem: ISupplyItem | undefined
  setSelectedSupplyItem: Dispatch<SetStateAction<ISupplyItem | undefined>>
}) {
  function autoFocus(element: HTMLElement | null, selected: boolean) {
    if (element && selected) element.focus()
  }

  function handleSelectionSupplyItem(e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, supplyItem: ISupplyItem) {
    setSelectedItem(supplyItem.item)
    setSelectedSupplyItem(supplyItem)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const items = [...supplyItems]
    items[index] = { ...items[index], [event.target.name]: event.target.valueAsNumber }
    setSupplyItems(items)
  }

  return (
    <ul className="">
      {supplyItems.map((supplyItem: ISupplyItem, index) => (
        <li
          key={index}
          onClick={(e) => handleSelectionSupplyItem(e, supplyItem)}
          className={`w-full items-center group grid grid-cols-12 gap-1 cursor-pointer rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 ${
            selectedItem.id === supplyItem.item.id && "bg-slate-300 dark:bg-slate-800"
          } ${selectedSection !== supplyItem.section && "hidden"}`}
        >
          <img
            src={import.meta.env.VITE_API_URL + "company/items/img/" + supplyItem.item?.img_url}
            alt="No image to show"
            className="rounded-full col-span-1"
          />
          <span className="col-span-1 text-center">{supplyItem.item?.code}</span>
          <span className="col-span-5">{supplyItem.item?.title}</span>
          <input
            ref={(element) => autoFocus(element, selectedItem.id === supplyItem.item.id)}
            type="number"
            name="percent"
            value={supplyItem.percent}
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />
          <input
            type="number"
            name="quantity"
            value={supplyItem.quantity}
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />

          <button
            onClick={() => setSupplyItems(supplyItems.filter((item) => item.item.id !== supplyItem.item.id))}
            className={`w-full h-full col-span-1 rounded-full opacity-60 active:scale-90 hover:opacity-100 hover:bg-slate-600 group-hover:visible ${
              selectedItem === supplyItem.item ? "visible" : "invisible"
            }`}
          >
            <i className="far fa-trash-can text-rose-600" />
          </button>
        </li>
      ))}
    </ul>
  )
}
