import { useEffect, useState } from "react"
import { useAirport } from "../hooks/useAirport"
import { useCompany } from "../hooks/useCompany"
import { useGetCompaniesForAirportQuery, useLazyGetCompanyDataQuery } from "../store/company/company.api"
import { Company, Item } from "../types/company.types"
import { useCreateContractMutation } from "../store/contracts/contract.api"
import { useAuth } from "../hooks/useAuth"

export default function SupplierSelector() {
  const { user } = useAuth()
  const { airport } = useAirport()
  const { company } = useCompany()
  const {
    data: suppliers,
    isLoading,
    error,
  } = useGetCompaniesForAirportQuery({ type: "supplier", airport: airport.id })

  const [getCompanyItems, { data: items, isFetching, error: err }] = useLazyGetCompanyDataQuery()
  const [selectedSupplier, setSelectedSupplier] = useState<Company | undefined>(undefined)
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined)

  useEffect(() => {
    if (selectedSupplier && selectedSupplier.id) {
      getCompanyItems({ type: "supplies", id: selectedSupplier.id }).unwrap()
    }
  }, [selectedSupplier])

  const [createContract, { data: newContract }] = useCreateContractMutation()

  async function setContract() {
    const created = await createContract({
      airport: airport.id,
      airline: company.id,
      supplier: selectedSupplier!.id,
      airline_signatory: user.id,
    }).unwrap()
  }

  return (
    <div className="md:flex">
      {airport.name && (!suppliers || !suppliers.length) && (
        <span>There are no registered suppliers for this airport</span>
      )}
      <div className="w-full md:w-1/3 md:text-2xl">
        {suppliers && suppliers.length > 0 && (
          <div className="w-full text-start">
            <span>Select supplier:</span>
            <div className="mt-2 bg-slate-300 dark:bg-slate-800 rounded-3xl shadow-md dark:shadow-slate-600">
              <ul>
                {suppliers.map((supplier: Company, index: number) => (
                  <li
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier(supplier)
                      setSelectedItem(undefined)
                    }}
                    className={`flex w-full px-4 justify-between rounded-full p-2 text-xl hover:bg-teal-500 dark:hover:bg-teal-700 cursor-pointer ${
                      selectedSupplier &&
                      selectedSupplier.id === supplier.id &&
                      "bg-teal-400 dark:bg-teal-600 font-semibold"
                    }`}
                  >
                    <span>{supplier.name}</span>
                    <span>{supplier.country_iso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {company.category === "airline" && items && items.length && (
          <div className="md:flex w-full justify-between items-center text-slate-900 dark:text-slate-100">
            <div className="w-full md:w-2/3 text-base mt-4 mr-4 text-justify">
              By clicking the "Set Contarct" button, you will request the selected supplier a catering service at the
              selected airport under the Standard In-flight Catering Agreement (SICA 2022)!
            </div>
            <div className="f-full md:w-1/3 m-4 font-semibold text-slate-200">
              <button
                onClick={setContract}
                className="flex w-full py-2 px-4 justify-between items-center bg-teal-800 rounded-full opacity-80 hover:opacity-100 active:scale-90 active:shadow-none shadow-md dark:shadow-slate-600"
              >
                <i className="fas fa-file-signature" />
                <span>Set Contract</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/3 py-2 md:px-4">
        {items && items.length > 0 && (
          <ul className="w-full max-h-[880px] overflow-y-scroll snap-y bg-slate-300 dark:bg-slate-800 rounded-3xl shadow-md dark:shadow-slate-600">
            {items.map((item: Item) => (
              <li
                key={item.id}
                onClick={() => {
                  setSelectedItem(item)
                }}
                className={`w-full p-2 px-4 flex snap-start justify-between rounded-full text-xl hover:bg-teal-600 cursor-pointer ${
                  selectedItem && selectedItem.id === item.id && "bg-teal-400 dark:bg-teal-600 font-semibold"
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={"http://localhost:3000/api/company/items/img/" + item.img_url}
                    alt=""
                    className="rounded-full max-h-[30px] mr-2"
                  />
                  <span>{item.title}</span>
                </div>

                <span>{"$" + " " + item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-full md:w-1/3">
        {selectedItem && (
          <div className="rounded-3xl bg-slate-300 dark:bg-slate-800 shadow-md dark:shadow-slate-600">
            <div className="flex justify-center">
              <span>Category:</span>
              <div className="font-semibold ml-4">{selectedItem.category}</div>
            </div>
            <div className="md:flex md:items-center">
              <div className="flex w-full justify-center md:max-w-[300px]">
                <img
                  src={"http://localhost:3000/api/company/items/img/" + selectedItem.img_url}
                  alt=""
                  className="hover:scale-125 transition-all"
                />
              </div>

              <div className="p-4">
                <div>Title: {selectedItem.title}</div>
                <div>Code: {selectedItem.code}</div>
                <div>Area: {selectedItem.area}</div>
              </div>
            </div>
            <div className="p-4">
              <div>Description:</div>
              <div className="text-base">{selectedItem.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
