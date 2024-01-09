import { useEffect, useState } from 'react'
import { useGetCompanyDataQuery } from '../store/company/company.api'
import { Flight, Item } from '../types/company.types'
import SupplyItem from './SupplyItem'

interface ISupplyItem {
  item: Item
  quantity: number
  percent: number | undefined
  section: string
}
const sections = ['PC & CC', 'FC', 'BC', 'YC', 'Inventory']

export default function SupplyDiagram({
  supplierId,
  flight,
}: {
  supplierId: number
  flight?: Flight
}) {
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [selectedSection, setSelectedSection] = useState(sections[0])
  const [supplyItems, setSupplyItems] = useState<ISupplyItem[]>([])
  const [selectedSupplyItem, setSelectedSupplyItem] = useState<
    ISupplyItem | undefined
  >(undefined)
  const { data: supplies } = useGetCompanyDataQuery({
    type: 'supplies',
    id: supplierId,
  })

  function handleItemsSelection(item: Item) {
    setSelectedItem(item)
    //add a supply item only if the same item does not exist in the selected section----------------------------------------
    if (
      supplyItems.every(
        (supplyItem) =>
          !(
            supplyItem.item?.id === item.id &&
            supplyItem.section === selectedSection
          )
      )
    ) {
      setSupplyItems([
        ...supplyItems,
        { item, quantity: 0, percent: undefined, section: selectedSection },
      ])
    }
    //set selected just chosen item if exists-------------------------------------------------------------------------------
    setSelectedSupplyItem(
      supplyItems.find((supplyItem) => supplyItem.item.id === item.id)
    )
  }

  function handleSelectionSection(section: string) {
    setSelectedSection(section)
  }

  function saveSchema() {
    console.log(supplyItems)
  }

  return (
    <div className="w-full md:flex">
      <ul className="w-full md:w-1/3 max-h-[644px] grid grid-cols-3 gap-y-1 overflow-y-scroll snap-y px-2">
        {supplies?.map((item) => (
          <li
            key={item.id}
            className="justify-center text-sm text-center cursor-pointer snap-start group max-h-min flex"
            onClick={() => handleItemsSelection(item)}
          >
            <div
              className={`group-hover:scale-100 rounded-3xl transition-all border ${
                selectedItem?.id === item.id
                  ? 'border-slate-400 scale-100'
                  : 'border-slate-700 scale-95'
              }`}
            >
              <span className="px-2">{item.title}</span>
              <img
                src={
                  import.meta.env.VITE_API_URL +
                  'company/items/img/' +
                  item.img_url
                }
                alt="No image to show"
                className="p-1"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="w-full md:w-2/3 text-base px-4">
        <div className="w-full grid grid-cols-5">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleSelectionSection(section)}
              className={`col-span-1 rounded-full border border-teal-600 active:scale-90 transition-all ${
                section === selectedSection
                  ? ' scale-x-110 bg-teal-600 hover:bg-teal-600'
                  : 'hover:bg-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
        <div className="w-full flex mx-2 px-2">
          <span className={`${flight ? 'text-slate-100' : 'text-slate-500'}`}>
            {flight && selectedSection !== 'Inventory'
              ? 'Enter ' +
                selectedSection +
                ' persons number for flight ' +
                flight.flight +
                ':'
              : selectedSection === 'Inventory'
              ? 'Enter Inventory'
              : 'No flight selected'}
          </span>
        </div>
        {selectedItem && (
          <div className="w-full text-base mx-2">
            <SupplyItem
              selectedSection={selectedSection}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              supplyItems={supplyItems}
              setSupplyItems={setSupplyItems}
              selectedSupplyItem={selectedSupplyItem}
              setSelectedSupplyItem={setSelectedSupplyItem}
            />
            <div className="flex w-full justify-end mt-4">
              <button
                onClick={saveSchema}
                className="px-4 py-1 text-base rounded-full bg-teal-500 dark:bg-teal-700 opacity-80 hover:opacity-100 active:scale-90"
              >
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
