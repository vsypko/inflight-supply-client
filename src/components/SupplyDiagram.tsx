import { useEffect, useState } from "react"
import { useGetCompanyDataQuery } from "../store/company/company.api"
import { Item } from "../types/company.types"
import SupplyItem from "./SupplyItem"

interface ISupplyItem {
  item: Item
  quantity: number
  percent: number
}

export default function SupplyDiagram({ supplierId }: { supplierId: number }) {
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [supplyItems, setSupplyItems] = useState<ISupplyItem[]>([])
  const [selectedSupplyItem, setSelectedSupplyItem] = useState<ISupplyItem>()
  const { data: supplies } = useGetCompanyDataQuery({ type: "supplies", id: supplierId })

  function handleItemsSelection(item: Item) {
    setSelectedItem(item)
    if (supplyItems.every((output) => output.item?.id !== item.id)) {
      setSupplyItems([...supplyItems, { item, quantity: 0, percent: 0 }])
    }
    setSelectedSupplyItem(supplyItems.find((output) => output.item.id === item.id))
  }

  return (
    <div className="w-full flex">
      <menu className="w-1/3 h-[600px] grid grid-cols-3 overflow-y-scroll">
        {supplies?.map((item) => (
          <li
            key={item.id}
            className={`justify-center text-sm hover:scale-110 transition-all rounded-xl text-center cursor-pointer m-2 ${
              selectedItem?.id === item.id ? "border border-slate-400" : "border border-slate-700"
            }`}
            onClick={() => handleItemsSelection(item)}
          >
            <span>{item.title}</span>
            <img
              src={import.meta.env.VITE_API_URL + "company/items/img/" + item.img_url}
              alt="No image to show"
              className=""
            />
          </li>
        ))}
      </menu>
      <div className="w-1/2">
        {selectedItem && (
          <div>
            <SupplyItem
              selectedItem={selectedItem}
              supplyItems={supplyItems}
              setSupplyItems={setSupplyItems}
              selectedSupplyItem={selectedSupplyItem}
              setSelectedSupplyItem={setSelectedSupplyItem}
              setSelectedItem={setSelectedItem}
            />
            <div className="flex w-full justify-end mt-4">
              <button className="px-4 py-1 text-base rounded-full bg-teal-400 dark:bg-teal-700 opacity-70 hover:opacity-100 active:scale-90">
                <i className="fas fa-download mr-2" />
                <span>SAVE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
