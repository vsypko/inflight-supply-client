import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { Item } from "../types/company.types"

interface ISupplyItem {
  item: Item
  quantity: number
  percent: number
}
export default function SupplyItem({
  selectedItem,
  setSelectedItem,
  supplyItems,
  setSupplyItems,
  selectedSupplyItem,
  setSelectedSupplyItem,
}: {
  selectedItem: Item
  setSelectedItem: Dispatch<SetStateAction<Item | undefined>>
  supplyItems: ISupplyItem[]
  setSupplyItems: Dispatch<React.SetStateAction<ISupplyItem[]>>
  selectedSupplyItem: ISupplyItem | undefined
  setSelectedSupplyItem: Dispatch<SetStateAction<ISupplyItem | undefined>>
}) {
  function handleSelectionSupplyItem(output: ISupplyItem) {
    setSelectedItem(output.item)
    setSelectedSupplyItem(output)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const items = [...supplyItems]
    items[index] = { ...items[index], [event.target.name]: event.target.value }
    setSupplyItems(items)
  }

  return (
    <ul className="w-full">
      {supplyItems.map((output: ISupplyItem, index) => (
        <li
          key={index}
          onClick={() => handleSelectionSupplyItem(output)}
          className={`grid grid-flow-col grid-cols-12 gap-1 cursor-pointer rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 w-full items-center group ${
            selectedItem === output.item && "bg-slate-300 dark:bg-slate-800"
          }`}
        >
          <img
            src={import.meta.env.VITE_API_URL + "company/items/img/" + output.item?.img_url}
            alt="No image to show"
            className="rounded-full col-span-1"
          />
          <span className="col-span-1 text-center">{output.item?.code}</span>
          <span className="col-span-5">{output.item?.title}</span>
          <input
            type="number"
            name="percent"
            value={output.percent}
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />
          <input
            type="number"
            name="quantity"
            value={output.quantity}
            className="appearance-none outline-none bg-transparent border border-slate-700 col-span-2"
            onChange={(e) => onChange(e, index)}
          />

          <button
            onClick={() => setSupplyItems(supplyItems.filter((item) => item.item.id !== output.item.id))}
            className={`w-full h-full col-span-1 rounded-full opacity-60 active:scale-90 hover:opacity-100 hover:bg-slate-600 group-hover:visible ${
              selectedItem === output.item ? "visible" : "invisible"
            }`}
          >
            <i className="far fa-trash-can text-rose-600" />
          </button>
        </li>
      ))}
    </ul>
  )
}
