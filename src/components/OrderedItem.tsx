import { ChangeEvent, Dispatch, SetStateAction, MouseEvent } from 'react'
import { IOrderItem, Item } from '../types/company.types'
import { useOrder } from '../hooks/useOrder'
import { useActions } from '../hooks/actions'

export default function OrderedItem({
  selectedSection,
  selectedItem,
  setSelectedItem,
  selectedOrderItem,
  setSelectedOrderItem,
}: {
  selectedSection: string
  selectedItem: Item | undefined
  setSelectedItem: Dispatch<SetStateAction<Item | undefined>>
  selectedOrderItem: IOrderItem | undefined
  setSelectedOrderItem: Dispatch<SetStateAction<IOrderItem | undefined>>
}) {
  const { orderItems } = useOrder()
  const { setOrderItems } = useActions()

  function onFocus(element: HTMLInputElement | null, selected: boolean) {
    if (element && selected) {
      element.focus()
      element.value =
        element.valueAsNumber === 0 ? '' : element.valueAsNumber.toString()
    }
  }

  function handleSelectionOrderedItem(
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
    supplyItem: IOrderItem
  ) {
    setSelectedItem(supplyItem.item)
    setSelectedOrderItem(supplyItem)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const items = [...orderItems]
    const value = event.target.valueAsNumber ? event.target.valueAsNumber : 0

    items[index] = {
      ...items[index],
      [event.target.name]: value,
    }
    setOrderItems(items)
  }

  return (
    <ul>
      {orderItems.map((orderItem: IOrderItem, index, arr) => (
        <li
          key={index}
          onClick={(e) => handleSelectionOrderedItem(e, orderItem)}
          className={`w-full mb-1 items-center group grid grid-cols-7 md:grid-cols-8 text-xs md:text-base  cursor-pointer rounded-full hover:bg-gradient-to-r from-transparent hover:to-slate-400 dark:hover:to-slate-700 ${
            selectedItem?.id === orderItem.item.id &&
            'bg-gradient-to-r from-slate-200 dark:from-slate-900 to-slate-400 dark:to-slate-700'
          } ${selectedSection !== orderItem.section && 'hidden'}`}
        >
          <div className="col-span-1 place-content-start flex items-center">
            <img
              src={
                import.meta.env.VITE_API_URL +
                'company/items/img/' +
                orderItem.item?.img_url
              }
              alt="No image to show"
              className="rounded-full h-6 w-6 md:h-8 md:w-8"
            />
            <span className="w-full text-end pr-2">{orderItem.item?.code}</span>
          </div>

          <span className="col-span-2 md:col-span-3">
            {orderItem.item.title}
          </span>
          <span className="col-span-1 justify-self-end pr-2">
            {'$ ' + orderItem.item.price.toFixed(2)}
          </span>
          <input
            ref={(element) =>
              onFocus(element, selectedItem?.id === orderItem.item.id)
            }
            type="number"
            name="qty"
            value={orderItem.qty}
            placeholder=" "
            className="col-span-1 text-right appearance-none outline-none bg-transparent border border-slate-700"
            onChange={(e) => onChange(e, index)}
          />
          <div className="col-span-2 justify-self-end">
            <span className="pr-2">
              {'$ ' + (orderItem.qty * orderItem.item.price).toFixed(2)}
            </span>
            <button
              onClick={() =>
                setOrderItems(
                  arr.filter((item) => item.item.id !== orderItem.item.id)
                )
              }
              className={`h-6 w-6 md:h-8 md:w-8 rounded-full opacity-70 active:scale-90 hover:opacity-100 hover:bg-slate-600 group-hover:visible ${
                selectedItem === orderItem.item ? 'visible' : 'invisible'
              }`}
            >
              <i className="far fa-trash-can text-rose-500 text-base md:text-lg" />
            </button>
          </div>
        </li>
      ))}
      {orderItems.length > 0 &&
        orderItems.some(
          (orderItem) => orderItem.section === selectedSection
        ) && (
          <div className="text-xs md:text-base grid grid-cols-7 md:grid-cols-8 border-t border-slate-300">
            <span className="col-span-4 md:col-span-5">Total:</span>
            <span className="col-span-1 justify-self-end">
              {orderItems.reduce(
                (accumulator, current) =>
                  current.section === selectedSection
                    ? accumulator + current.qty
                    : accumulator,
                0
              )}
            </span>
            <span className="col-span-2 justify-self-end mr-8 md:mr-10">
              {'$ ' +
                orderItems
                  .reduce(
                    (accumulator, current) =>
                      current.section === selectedSection
                        ? accumulator + current.item.price * current.qty
                        : accumulator,
                    0
                  )
                  .toFixed(2)}
            </span>
          </div>
        )}
    </ul>
  )
}
