import { useState, UIEvent, useEffect, useRef } from "react"
import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import DropArea from "../components/DropArea"
import { useGetCompaniesForAirportQuery, useLazyGetCompanyDataQuery } from "../store/company/company.api"
import { Company, Item } from "../types/company.types"
import Curve from "../components/Curve"

type Pos = {
  draged: boolean
  x: number
  y: number
  dx: number
  dy: number
}

export default function Airlines_Alter() {
  const { airport } = useAirport()
  const { user } = useAuth()

  const [selectedSupplier, setSelectedSupplier] = useState<Company | undefined>(undefined)
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined)

  const [suppliersPosition, setSuppliersPosition] = useState<Pos>({
    draged: false,
    x: 10,
    y: 250,
    dx: 0,
    dy: 0,
  })
  const [itemsPosition, setItemsPosition] = useState<Pos>({
    draged: false,
    x: 600,
    y: 250,
    dx: 0,
    dy: 0,
  })
  const [itemPosition, setItemPosition] = useState<Pos>({ draged: false, x: 1200, y: 250, dx: 0, dy: 0 })

  const {
    data: suppliers,
    isLoading,
    error,
  } = useGetCompaniesForAirportQuery({ type: "supplier", airport: airport.id })

  const [getCompanyItems, { data: items, isFetching, error: err }] = useLazyGetCompanyDataQuery()

  useEffect(() => {
    if (selectedSupplier && selectedSupplier.id) {
      getCompanyItems({ type: "supplies", id: selectedSupplier.id }).unwrap()
    }
  }, [selectedSupplier])

  const [scrollTop, setScrollTop] = useState(0)
  function handleScroll(e: EventTarget & HTMLUListElement) {
    setScrollTop(e.scrollTop)
  }

  return (
    <DropArea
      positions={[
        { pos: suppliersPosition, setPos: setSuppliersPosition },
        { pos: itemsPosition, setPos: setItemsPosition },
        { pos: itemPosition, setPos: setItemPosition },
      ]}
    >
      <div className="w-full py-4 px-2 text-center text-3xl font-bold mt-14">INFLIGHT SUPPLY ORDERS</div>
      {selectedSupplier && items && <Curve leftId={"supplier" + selectedSupplier.id?.toString()} rightId="itemsBox" />}
      {selectedItem && <Curve leftId={"item" + selectedItem.id?.toString()} rightId="itemBox" />}
      {!airport.name && (
        <div>
          <div>AIRPORT NOT SELECTED</div>
          <div>Select an airport on the AIRPORTS tab</div>
        </div>
      )}
      {airport.name && (
        <div>
          <div className="flex text-2xl font-bold px-2">
            <span className="uppercase">{airport.name}</span>
            <span className="ml-6">{airport.iata}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col px-2">
        <span>No one supplier selected</span>
        <span>Choose a supplier for the selected airport:</span>
        <span>Enter into Standard Inflight Catering Agreement (SICA 2022) with them</span>
      </div>

      {suppliers && suppliers.length > 0 && (
        <div
          id="suppliersBox"
          style={{ left: `${suppliersPosition.x}px`, top: `${suppliersPosition.y}px` }}
          className="w-full md:w-1/4 absolute bg-slate-300 dark:bg-slate-800 rounded-3xl shadow-lg"
        >
          <div
            className="w-full relative justify-between flex text-xl p-1 px-3 text-teal-700 dark:text-teal-400 opacity-70 hover:opacity-100  rounded-t-3xl hover:cursor-grab active:cursor-grabbing"
            id="suppliers"
            onPointerDown={(e) => {
              e.preventDefault()
              setSuppliersPosition((pos) => ({ ...pos, draged: true, dx: e.pageX - pos.x, dy: e.pageY - pos.y }))
            }}
          >
            <span>Suppliers:</span>
            <div className="flex items-center">
              <i className="fas fa-arrows-turn-to-dots" />
            </div>
          </div>
          <ul>
            {suppliers.map((supplier: Company, index: number) => (
              <li
                key={supplier.id}
                id={`supplier${supplier.id}`}
                onClick={() => {
                  setSelectedSupplier(supplier)
                  setSelectedItem(undefined)
                }}
                className={`flex w-full justify-between rounded-full p-2 text-xl hover:bg-teal-600 cursor-pointer ${
                  selectedSupplier &&
                  selectedSupplier.id === supplier.id &&
                  "bg-slate-500 dark:bg-slate-700 text-slate-200 border-r-8 border-teal-600 shadow-xl font-semibold"
                }`}
              >
                <span>{supplier.name}</span>
                <span>{supplier.country_iso}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items && (
        <div
          id="itemsBox"
          style={{ left: `${itemsPosition.x}px`, top: `${itemsPosition.y}px` }}
          className="w-full md:w-1/4 absolute rounded-3xl bg-slate-300 dark:bg-slate-800 shadow-lg border-l-8 border-teal-600"
        >
          <div
            className="w-full relative justify-between flex text-xl p-1 px-3 text-teal-700 dark:text-teal-400 opacity-70 hover:opacity-100 hover:cursor-grab active:cursor-grabbing"
            id="items"
            onPointerDown={(e) => {
              e.preventDefault()
              setItemsPosition((pos) => ({ ...pos, draged: true, dx: e.pageX - pos.x, dy: e.pageY - pos.y }))
            }}
          >
            <span>{selectedSupplier?.name + " supplies items range:"}</span>
            <div className="flex items-center">
              <i className="fas fa-arrows-turn-to-dots" />
            </div>
          </div>

          <ul
            id="itemsUl"
            className="w-full max-h-[396px] overflow-y-scroll snap-y"
            onScroll={(e) => handleScroll(e.currentTarget)}
          >
            {items.map((item: Item, index: number) => (
              <li
                key={item.id}
                id={`item${item.id}`}
                onClick={() => {
                  setSelectedItem(item)
                }}
                className={`w-full flex snap-start justify-between rounded-full p-2 text-xl hover:bg-teal-600 cursor-pointer ${
                  selectedItem &&
                  selectedItem.id === item.id &&
                  "bg-slate-500 dark:bg-slate-700 text-slate-200 border-r-8 border-teal-600"
                }`}
              >
                <span>{item.title}</span>
                <span className="justify-end">{"$" + " " + item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedItem && (
        <div
          id="itemBox"
          style={{ left: `${itemPosition.x}px`, top: `${itemPosition.y}px` }}
          className="absolute rounded-3xl bg-slate-300 dark:bg-slate-800 shadow-lg border-l-8 border-teal-600"
        >
          <div
            className="w-full relative justify-between flex text-xl p-1 px-3 text-teal-700 dark:text-teal-400 opacity-70 hover:opacity-100 hover:cursor-grab active:cursor-grabbing"
            id="items"
            onPointerDown={(e) => {
              e.preventDefault()
              setItemPosition((pos) => ({ ...pos, draged: true, dx: e.pageX - pos.x, dy: e.pageY - pos.y }))
            }}
          >
            <span>{selectedItem?.title}</span>
            <span>{selectedItem.code}</span>

            <div className="flex items-center">
              <i className="fas fa-arrows-turn-to-dots" />
            </div>
          </div>
          <img
            src={"http://localhost:3000/api/company/items/img/" + selectedItem.img_url}
            alt=""
            className="h-[300px] w-[300px]"
          />
        </div>
      )}
    </DropArea>
  )
}
