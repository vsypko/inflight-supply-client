import { useEffect, useState, KeyboardEvent } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { useSearchAirportQuery } from '../store/airport/airport.api'
import SearchDropdown from './SearchDropdown'
import { useDebounce } from '../hooks/debounce'
import { useActions } from '../hooks/actions'
import { useAirport } from '../hooks/useAirport'
import { initialState } from '../store/airport/airport.slice'

export default function AirportSelector() {
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { airport } = useAirport()
  const { selectAirport } = useActions()

  const debounced = useDebounce(search, 700)

  const { data, isLoading, isError, error } = useSearchAirportQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const unselectHandler = () => {
    setSearch('')
    selectAirport(initialState.airport)
  }

  useEffect(() => {
    if (data) {
      setErrorMsg('')
      setDropdownOpen(
        debounced.length >= 3 && data?.airports.length! > 0 && !airport.name
      )
    }
    if (error) {
      if (error != null && typeof error === 'object' && 'data' in error)
        setErrorMsg(error.data as string)
      if (error != null && typeof error === 'object' && 'error' in error)
        setErrorMsg(error.error as string)
    }
  }, [data, error])

  return (
    <div className="w-full relative">
      <div className="w-full flex relative">
        <button
          className="flex items-center justify-center absolute left-0 top-0 z-10 text-xl w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700"
          onClick={unselectHandler}
          disabled={!airport.name}
        >
          <i
            className={`fas fa-magnifying-glass opacity-70 transition-all duration-300 ${
              airport.name ? 'rotate-90 hover:opacity-100' : 'rotate-0'
            }`}
          />
        </button>

        <div
          className={`flex relative ml-5 rounded-r-full bg-slate-300 dark:bg-slate-700 shadow-md shadow-slate-700 transition-all duration-300 ease-out h-10 ${
            airport.name ? 'w-0' : 'w-full'
          }`}
        >
          <input
            required
            title="Please enter at least the first three letters of the name, IATA code, country or airport municipality"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search airport ..."
            autoFocus
            type="text"
            className="bg-transparent rounded-full outline-none pl-6 w-full h-10 text-xl"
            id="airport"
            autoComplete="off"
          />

          {dropdownOpen && (
            <div className="absolute z-20 top-10 left-1 right-5 rounded-b-3xl max-h-[360px] overflow-y-scroll snap-y shadow-md shadow-slate-700 bg-slate-100 dark:bg-slate-800">
              <SearchDropdown
                items={data?.airports}
                setOpen={setDropdownOpen}
                selector={selectAirport}
                dataView={['name', 'iata']}
              />
            </div>
          )}
        </div>

        <div
          className={`flex justify-between items-center text-xl transition-all duration-300 ease-out ${
            !airport.name ? 'w-0 hidden' : 'w-full'
          }`}
        >
          <h1 className="uppercase mr-2 ml-8">{airport.name}</h1>
          <h1 className="font-bold">{airport.iata}</h1>
        </div>
      </div>

      {isError && <div className="text-red-500">{errorMsg}</div>}
      {isLoading && (
        <div className="absolute top-28 left-10 z-10">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
