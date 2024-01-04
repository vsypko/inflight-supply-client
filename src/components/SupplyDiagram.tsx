import { useEffect, useState } from "react"
import { useGetCompanyDataQuery } from "../store/company/company.api"
import { Item } from "../types/company.types"
import SupplyItem from "./SupplyItem"

interface ISupplyItem {
  item: Item
  quantity: number
  percent: number
  section: string
}
const sections = ["PC & CC", "FC", "BC", "YC"]

export default function SupplyDiagram({ supplierId }: { supplierId: number }) {
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [selectedSection, setSelectedSection] = useState("PC & CC")
  const [supplyItems, setSupplyItems] = useState<ISupplyItem[]>([])
  const [selectedSupplyItem, setSelectedSupplyItem] = useState<ISupplyItem | undefined>(undefined)
  const { data: supplies } = useGetCompanyDataQuery({ type: "supplies", id: supplierId })

  function handleItemsSelection(item: Item) {
    setSelectedItem(item)
    //add a supply item only if the same item does not exist in the selected section----------------------------------------
    if (supplyItems.every((output) => !(output.item?.id === item.id && output.section === selectedSection))) {
      setSupplyItems([...supplyItems, { item, quantity: 0, percent: 0, section: selectedSection }])
    }
    //set selected just chosen item if exists-------------------------------------------------------------------------------
    setSelectedSupplyItem(supplyItems.find((output) => output.item.id === item.id))
  }

  function handleSelectionSection(section: string) {
    setSelectedSection(section)
    setSelectedSupplyItem(undefined)
  }

  return (
    <div className="w-full md:flex md:m-2 md:p-2">
      <ul className="w-full md:w-1/3 max-h-[644px] grid grid-cols-3 overflow-y-scroll snap-y">
        {supplies?.map((item) => (
          <li
            key={item.id}
            className={`justify-center text-sm hover:scale-110 transition-all rounded-xl text-center cursor-pointer m-2 snap-start ${
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
      </ul>
      <div className="w-full md:w-1/2">
        <div className="w-full grid grid-cols-4 my-2 px-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleSelectionSection(section)}
              className={`col-span-1 p-2 rounded-full border border-teal-600 active:scale-90 transition-all ${
                section === selectedSection
                  ? " scale-x-125 bg-teal-600 hover:bg-teal-600"
                  : "hover:bg-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {section}
            </button>
          ))}
        </div>
        {selectedItem && (
          <div className="w-full text-base">
            <SupplyItem
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              supplyItems={supplyItems.filter((item) => item.section === selectedSection)}
              setSupplyItems={setSupplyItems}
              selectedSupplyItem={selectedSupplyItem}
              setSelectedSupplyItem={setSelectedSupplyItem}
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
