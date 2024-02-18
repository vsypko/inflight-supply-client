import { useEffect, useState } from 'react'
import { useGetCompanyDataQuery } from '../store/company/company.api'
import { FlightSelected, IOrderItem, Item } from '../types/company.types'
import OrderedItem from './OrderedItem'
import { useOrder } from '../hooks/useOrder'

export default function Orders() {
  const { order, selectedFlights } = useOrder()
  let allSections = ['crew', 'fc', 'bc', 'yc', 'inventory']
  const [sections, setSections] = useState(allSections)
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [selectedSection, setSelectedSection] = useState('')
  const [orderedItems, setOrderedItems] = useState<IOrderItem[]>([])
  const [selectedOrderedItem, setSelectedOrderedItem] = useState<
    IOrderItem | undefined
  >(undefined)
  // const [order, setOrder] = useState<IOrder>()
  const { data: supplies } = useGetCompanyDataQuery(
    {
      type: 'supplies',
      id: order.contract?.supplier,
    },
    {
      skip: !order.contract?.supplier,
      refetchOnFocus: true,
    }
  )

  useEffect(() => {
    if (selectedFlights) {
      allSections = allSections.filter((section: string) =>
        selectedFlights.some(
          (selectedItem: FlightSelected) =>
            selectedItem[section as keyof FlightSelected] !== 0
        )
      )
      setSections(allSections)
      setSelectedSection(allSections[0])
    }
  }, [selectedFlights])

  function handleItemsSelection(item: Item) {
    setSelectedItem(item)
    //add a supply item only if the same item does not exist in the selected section----------------------------------------
    if (
      orderedItems.every(
        (orderedItem) =>
          !(
            orderedItem.item?.id === item.id &&
            orderedItem.section === selectedSection
          )
      )
    ) {
      //add ordered item and set it initial values to 0---------------------------------------------------------------------
      setOrderedItems([
        ...orderedItems,
        {
          id: undefined,
          orderId: order && order.id ? order.id : undefined,
          item,
          qty: 0,
          amount: 0,
          section: selectedSection,
        },
      ])
    }
    //set selected just chosen item if exists-------------------------------------------------------------------------------
    setSelectedOrderedItem(
      orderedItems.find((orderedItem) => orderedItem.item.id === item.id)
    )
  }

  function handleSelectionSection(section: string) {
    setSelectedSection(section)
  }

  function saveSchema() {
    console.log(selectedFlights, orderedItems)
  }

  return (
    <div className="w-full md:flex">
      <div className="w-full md:w-2/3 text-base md:px-6">
        <div
          className={`w-full grid gap-2 ${
            sections.length === 5
              ? 'grid-cols-5'
              : sections.length === 4
              ? 'grid-cols-4'
              : 'grid-cols-3'
          }`}
        >
          {sections &&
            sections.map((section) => (
              <div key={section} className="flex flex-col">
                <button
                  onClick={() => handleSelectionSection(section)}
                  className={`col-span-1 rounded-full transition-all h-10 ${
                    section === selectedSection
                      ? 'scale-x-110 bg-teal-600 shadow-md shadow-slate-400 opacity-100 z-10'
                      : 'opacity-70 hover:opacity-100 dark:bg-slate-800 bg-slate-300 shadow-sm shadow-slate-400 active:scale-90'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="uppercase font-bold">{section}</span>
                    {selectedFlights.length === 1 && (
                      <span className="text-xs right-3">
                        {selectedFlights[0][section as keyof FlightSelected]
                          ? ' capacity: ' +
                            selectedFlights[0][section as keyof FlightSelected]
                          : ''}
                      </span>
                    )}
                  </div>
                </button>
                {/* --- Warning of the current section capacity exceeding!   ------------------ */}
                {section === selectedSection &&
                  selectedFlights.length === 1 && (
                    <span className="text-rose-600 text-xs mt-1 text-center transition-all">
                      {orderedItems.reduce(
                        (accumulator, current) =>
                          current.section === selectedSection
                            ? accumulator + current.qty
                            : accumulator,
                        0
                      ) >
                        Number(
                          selectedFlights[0][section as keyof FlightSelected]
                        ) && 'Total quantity exceeds capacity!'}
                    </span>
                  )}
              </div>
            ))}
        </div>

        {selectedItem && (
          <div className="w-full text-base">
            <OrderedItem
              selectedSection={selectedSection}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              orderedItems={orderedItems}
              setOrderedItems={setOrderedItems}
              selectedOrderedItem={selectedOrderedItem}
              setSelectedOrderedItem={setSelectedOrderedItem}
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
      <ul className="w-full md:w-1/3 max-h-[644px] grid grid-cols-3 gap-y-1 overflow-y-scroll snap-y p-2">
        {supplies?.map((item) => (
          <li
            key={item.id}
            className={`justify-center text-sm text-center cursor-pointer snap-start group min-h-max ${
              selectedSection !== 'inventory'
                ? item.category === 'Inventory'
                  ? 'hidden'
                  : 'flex'
                : item.category === 'Inventory'
                ? 'flex'
                : 'hidden'
            }`}
            onClick={() => handleItemsSelection(item)}
          >
            <div
              className={`group-hover:scale-100 rounded-3xl transition-all border ${
                selectedItem?.id === item.id
                  ? 'border-slate-600 dark:border-slate-400 scale-100'
                  : 'border-slate-300 dark:border-slate-700 scale-95'
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
    </div>
  )
}
