import { useEffect, useState, ReactHTMLElement } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useSearchAirportQuery } from "../store/airport/airport.api"
import Dropdown from "../components/DropdownData"
import { useDebounce } from "../hooks/debounce"
import { useAppSelector } from "../hooks/redux"
import { useActions } from "../hooks/actions"

export default function Search() {
  const [search, setSearch] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const { selected } = useAppSelector((state) => state.airport)
  const { selectAirport } = useActions()

  const debounced = useDebounce(search, 700)

  const { data, isLoading, isError, error } = useSearchAirportQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const unselectHandler = () => {
    setSearch("")
    selectAirport(null)
  }

  useEffect(() => {
    if (data) {
      setErrorMsg("")
      setDropdownOpen(debounced.length >= 3 && data?.airports.length! > 0 && !selected)
    }
    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [data, error])

  return (
    <div className="w-full relative">
      <div className="w-full flex relative">
        <button
          className="flex items-center justify-center absolute left-0 top-0 z-10 text-xl w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700"
          onClick={unselectHandler}
          disabled={!selected}
        >
          <i
            className={`fas fa-magnifying-glass opacity-70 transition-all duration-300 ${
              selected ? "rotate-90 hover:opacity-100" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`flex ml-5 rounded-r-full bg-slate-300 dark:bg-slate-700 transition-all duration-300 ease-out h-10 ${
            selected ? "w-0" : "w-full"
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
            className="bg-transparent rounded-full outline-none ml-7 w-full text-xl h-10"
            id="airport"
          />
        </div>

        <div
          className={`flex justify-between items-center text-xl transition-all duration-300 ease-out ${
            !selected ? "w-0 hidden" : "w-full"
          }`}
        >
          <h1 className="uppercase mr-2 ml-8">{selected?.ap_name}</h1>
          <h1 className="font-bold">{selected?.ap_iata_code}</h1>
        </div>
      </div>

      {dropdownOpen && <Dropdown items={data?.airports} setOpen={setDropdownOpen} />}
      {isError && <div className="text-red-500">{errorMsg}</div>}
      {isLoading && (
        <div className="mt-28">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
