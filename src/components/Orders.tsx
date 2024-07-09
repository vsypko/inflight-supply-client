import { useEffect, useState } from 'react'
import { useGetCompanyDataQuery } from '../store/company/company.api'
import { FlightSelected, IOrderItem, Item } from '../types/company.types'
import OrderedItem from './OrderedItem'
import { useOrder } from '../hooks/useOrder'
import {
  useDeleteOrderMutation,
  useSetOrderMutation,
} from '../store/orders/orders.api'
import { useActions } from '../hooks/actions'
import { useContract } from '../hooks/useContract'

export default function Orders() {
  let allSections = ['crew', 'fc', 'bc', 'yc', 'inventory']

  const { orderItems, selectedFlights } = useOrder()
  const { contract } = useContract()
  const [addOrder] = useSetOrderMutation()
  const [deleteOrder] = useDeleteOrderMutation()
  const { setOrderItems, setSelectedFlights } = useActions()

  const [sections, setSections] = useState(allSections)
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [selectedSection, setSelectedSection] = useState('')

  const [selectedOrderItem, setSelectedOrderItem] = useState<
    IOrderItem | undefined
  >(undefined)

  const { data: supplies } = useGetCompanyDataQuery(
    {
      type: 'supplies',
      id: contract?.supplier,
    },
    {
      skip: !contract?.supplier,
      refetchOnFocus: true,
    }
  )

  useEffect(() => {
    if (selectedFlights) {
      allSections = allSections.filter((section: string) =>
        selectedFlights.some(
          (slct) => slct[section as keyof FlightSelected] !== 0
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
      orderItems.every(
        (orderItem) =>
          !(
            orderItem.item.id === item.id &&
            orderItem.section === selectedSection
          )
      )
    ) {
      //add item to order and set it initial values to 0---------------------------------------------------------------------
      setOrderItems([
        ...orderItems,
        {
          id: undefined,
          item,
          price: item.price,
          qty: 0,
          section: selectedSection,
        },
      ])
    }
    //------ set item in order as selected -------------------------------------------------------------------------------
    setSelectedOrderItem(
      orderItems.find((orderItem) => orderItem.item.id === item.id)
    )
  }

  function handleSelectionSection(section: string) {
    setSelectedSection(section)
  }

  async function handleOrderSubmit() {
    const savingItems = orderItems.filter((item) => item.qty > 0)
    if (savingItems.length > 0) {
      const res = await addOrder({
        flights: selectedFlights.map((flight) => flight.id),
        items: savingItems.map((item) => ({
          item_id: item.item.id,
          item_price: item.item.price,
          item_qty: item.qty,
          item_section: item.section,
        })),
      }).unwrap()
    }
  }

  async function handleOrderDelete() {
    const flightIds: number[] = selectedFlights
      .filter((flight) => flight.ordered)
      .map((flight) => flight.id)
    const res =
      flightIds.length && (await deleteOrder({ ids: flightIds }).unwrap())
    setOrderItems([])
  }

  return (
    <div className="w-full md:flex">
      <div className="w-full md:w-2/4 text-base md:px-6">
        <div
          className={`w-full grid gap-1 ${
            sections.length === 5
              ? 'grid-cols-5'
              : sections.length === 4
              ? 'grid-cols-4'
              : 'grid-cols-3'
          }`}
        >
          {selectedSection &&
            sections.map((section) => (
              <div key={section} className="flex flex-col">
                <button
                  onClick={() => handleSelectionSection(section)}
                  className={`col-span-1 rounded-full transition-all h-10 shadow-sm shadow-slate-600 active:shadow-none ${
                    section === selectedSection
                      ? 'scale-x-110 bg-teal-600 opacity-100 z-10'
                      : 'opacity-70 hover:opacity-100 dark:bg-slate-800 bg-slate-300 active:scale-90'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="uppercase font-bold text-xs md:text-base">
                      {section}
                    </span>
                    {selectedFlights.length === 1 && (
                      <span className="text-[9px] md:text-xs">
                        {selectedFlights[0][section as keyof FlightSelected]
                          ? ' capacity: ' +
                            selectedFlights[0][section as keyof FlightSelected]
                          : ''}
                      </span>
                    )}
                  </div>
                </button>
                {/* --- Warning of the current cabin section capacity exceeding!   ------------------ */}
                {section === selectedSection &&
                  selectedFlights.length === 1 && (
                    <span className="text-rose-600 text-xs mt-1 text-center transition-all">
                      {orderItems.reduce(
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

        <div className="w-full text-base mt-4">
          <OrderedItem
            selectedSection={selectedSection}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            selectedOrderItem={selectedOrderItem}
            setSelectedOrderItem={setSelectedOrderItem}
          />
          {(orderItems.length > 0 ||
            selectedFlights.some((flight) => flight.ordered)) && (
            <div className="flex w-full justify-end mt-4 gap-2">
              <button
                onClick={handleOrderDelete}
                className="px-4 py-1 text-base rounded-full bg-rose-500 dark:bg-rose-700 opacity-80 hover:opacity-100 active:scale-90 shadow-sm shadow-slate-600 active:shadow-none"
              >
                <i className="far fa-trash-can  mr-2" />
                <span>DELETE</span>
              </button>

              {orderItems.length > 0 && (
                <button
                  onClick={handleOrderSubmit}
                  className="px-4 py-1 text-base rounded-full bg-teal-500 dark:bg-teal-700 opacity-80 hover:opacity-100 active:scale-90"
                >
                  <i className="fas fa-download mr-2" />
                  <span>SAVE</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedSection && (
        <ul className="w-full md:w-1/4 mt-6 max-h-[644px] grid grid-cols-3 gap-1 overflow-y-scroll snap-y">
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
      )}
    </div>
  )
}
