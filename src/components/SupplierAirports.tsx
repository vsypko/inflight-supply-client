import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/debounce'
import { useCompany } from '../hooks/useCompany'
import { useSearchAirportQuery } from '../store/airport/airport.api'
import SearchDropdown from './SearchDropdown'
import { Airport } from '../types/airport.types'
import {
  useDeleteCompanyDataMutation,
  useGetCompanyDataQuery,
  useInsertCompanyDataMutation,
} from '../store/company/company.api'
import { Place } from '../types/company.types'

export default function SupplierAirports() {
  const { company } = useCompany()
  const { data: places, isLoading } = useGetCompanyDataQuery({
    type: 'places',
    id: company.id,
  })

  const [search, setSearch] = useState('')
  const [addon, setAddon] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [airports, setAirports] = useState<Airport[]>([])
  const debounced = useDebounce(search, 700)

  const { data, isFetching, isError, error } = useSearchAirportQuery(
    debounced,
    {
      skip: debounced.length < 3,
      refetchOnFocus: true,
    }
  )

  const [insertPlace] = useInsertCompanyDataMutation()
  const [deletePlace] = useDeleteCompanyDataMutation()

  useEffect(() => {
    if (data) {
      setErrorMsg('')
      setDropdownOpen(debounced.length >= 3 && data?.airports.length! > 0)
    }
    if (error) {
      if (error != null && typeof error === 'object' && 'data' in error)
        setErrorMsg(error.data as string)
      if (error != null && typeof error === 'object' && 'error' in error)
        setErrorMsg(error.error as string)
    }
  }, [data, error])

  async function addAirport(place: Airport) {
    setSearch('')
    await insertPlace({
      type: 'places',
      values: [{ airport_id: place.id, company_id: company.id }],
    }).unwrap()
    setAddon(false)
  }

  async function delAirport(place: Place) {
    const res = await deletePlace({ type: 'places', id: place.id }).unwrap()
  }

  function cancelSearch() {
    setSearch('')
    setDropdownOpen(false)
    setAddon(false)
  }

  return (
    <div className="w-full">
      {errorMsg && (
        <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>
      )}
      <div className="rounded-2xl shadow-md dark:shadow-slate-600 dark:bg-slate-800 bg-slate-100 px-4 max-h-[400px] overflow-auto">
        {places?.map((place, index) => (
          <div className="flex text-base" key={place.id}>
            <div className="flex w-11/12 my-2">
              <span className="justify-end items-center">{index + 1}</span>
              <div className="flex w-full ml-2 justify-between items-center">
                <span>{place.name}</span>
                <span>{place.iata}</span>
              </div>
            </div>
            <div className="flex w-1/12 justify-end">
              <button
                className="opacity-70 hover:opacity-100 active:scale-90"
                onClick={() => delAirport(place)}
              >
                <i className="fas fa-trash-can" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full mt-4 ">
        <div className="flex w-full relative">
          <input
            title="Please enter at least the first three letters of the name, IATA code, country or airport municipality"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search airport ..."
            autoFocus
            type="text"
            className={`outline-none transition-all ease-out rounded-full bg-slate-100 dark:bg-slate-800 shadow-lg h-9 ${
              addon ? 'px-4 w-full' : 'w-0'
            }`}
          />

          <div
            className={`absolute z-10 top-10 left-2 right-2 rounded-2xl transition-all ease-out overflow-y-scroll shadow-lg bg-slate-100 dark:bg-slate-800 ${
              dropdownOpen ? 'max-h-80' : 'max-h-0'
            }`}
          >
            <SearchDropdown
              items={data?.airports}
              setOpen={setDropdownOpen}
              selector={addAirport}
              dataView={['name', 'iata']}
            />
          </div>
          <div className="absolute right-3 top-1">
            {addon && (
              <button
                onClick={cancelSearch}
                className="text-2xl rounded-full opacity-70 hover:opacity-100 active:scale-90"
              >
                <i className="fas fa-xmark" />
              </button>
            )}
          </div>
        </div>

        <div className="justify-end">
          {!addon && (
            <button
              onClick={() => setAddon(true)}
              className="px-4 py-1 flex items-center text-base rounded-full bg-teal-400 dark:bg-teal-700 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plus mr-2" />
              <span>NEW</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
