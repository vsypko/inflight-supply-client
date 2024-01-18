import { useEffect, useState } from 'react'
import { useAirport } from '../hooks/useAirport'
import { useCompany } from '../hooks/useCompany'
import {
  useGetCompaniesForAirportQuery,
  useLazyGetCompanyDataQuery,
} from '../store/company/company.api'
import { Company, Item } from '../types/company.types'
import { useCreateContractMutation } from '../store/contracts/contract.api'
import { useAuth } from '../hooks/useAuth'

export default function SupplierSelector() {
  const { user } = useAuth()
  const { airport } = useAirport()
  const { company } = useCompany()
  const {
    data: suppliers,
    isLoading,
    error,
  } = useGetCompaniesForAirportQuery(
    { type: 'supplier', airport: airport.id },
    { refetchOnFocus: true }
  )

  const [getCompanyItems, { data: items, isFetching, error: err }] =
    useLazyGetCompanyDataQuery()
  const [selectedSupplier, setSelectedSupplier] = useState<Company | undefined>(
    undefined
  )
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined)

  useEffect(() => {
    if (selectedSupplier && selectedSupplier.id) {
      getCompanyItems({ type: 'supplies', id: selectedSupplier.id }).unwrap()
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
    <div className="md:flex w-full">
      {airport.name && (!suppliers || !suppliers.length) && (
        <span className="flex w-full">
          There are no registered suppliers for this airport
        </span>
      )}

      <div className="w-full md:w-3/12">
        {suppliers && suppliers.length > 0 && (
          <div className="w-full text-start">
            <span>Select supplier:</span>
            <div className="w-full mt-2 bg-slate-300 dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-600">
              <ul>
                {suppliers.map((supplier: Company, index: number) => (
                  <li
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier(supplier)
                      setSelectedItem(undefined)
                    }}
                    className={`flex w-full justify-between rounded-full px-4 hover:bg-teal-500 dark:hover:bg-teal-700 cursor-pointer ${
                      selectedSupplier &&
                      selectedSupplier.id === supplier.id &&
                      'bg-teal-400 dark:bg-teal-600 font-semibold'
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
        {company.category === 'airline' && items && items.length && (
          <div className="w-full mt-2 text-slate-900 dark:text-slate-100">
            <div className="text-base text-justify">
              By clicking the "Set Contarct" button, you will request the
              selected supplier a catering service at the selected airport under
              the Standard In-flight Catering Agreement (SICA 2022)!
            </div>
            <div className="mt-2 justify-end w-full flex">
              <button
                onClick={setContract}
                className="flex px-4 font-semibold text-slate-200 items-center bg-teal-800 rounded-full opacity-80 transition-all shadow-md dark:shadow-slate-600 hover:opacity-100 active:scale-95 active:shadow-none"
              >
                <i className="fas fa-file-signature mr-2" />
                <span>Set Contract</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/3 md:mt-8 md:px-6">
        {items && items.length > 0 && (
          <ul className="w-full max-h-[680px] overflow-y-scroll snap-y bg-slate-300 dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-600">
            {items.map((item: Item) => (
              <li
                key={item.id}
                onClick={() => {
                  setSelectedItem(item)
                }}
                className={`w-full grid grid-cols-10 my-1 px-2 snap-start items-center rounded-full text-sm hover:bg-teal-600 cursor-pointer ${
                  selectedItem &&
                  selectedItem.id === item.id &&
                  'bg-teal-400 dark:bg-teal-600'
                }`}
              >
                <img
                  src={
                    import.meta.env.VITE_API_URL +
                    'company/items/img/' +
                    item.img_url
                  }
                  alt=""
                  className="max-h-[30px]"
                />
                <span className="col-span-4">{item.title}</span>
                <span className="col-span-3">{item.category}</span>
                <span className="col-span-2 place-content-end grid">
                  {'$' + ' ' + item.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-full md:w-5/12 md:pr-4 md:mt-8">
        {selectedItem && (
          <div className="rounded-3xl bg-slate-300 dark:bg-slate-800 shadow-md dark:shadow-slate-600">
            <div className="flex justify-center">
              <span>Category:</span>
              <div className="font-semibold ml-4">{selectedItem.category}</div>
            </div>
            <div className="md:flex md:items-center">
              <div className="flex w-full justify-center md:max-w-[300px]">
                <img
                  src={
                    import.meta.env.VITE_API_URL +
                    'company/items/img/' +
                    selectedItem.img_url
                  }
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
