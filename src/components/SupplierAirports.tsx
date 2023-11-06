import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/debounce"
import { useCompany } from "../hooks/useCompany"
import { useSearchAirportQuery } from "../store/airport/airport.api"
import SearchDropdown from "./SearchDropdown"

export default function SupplierAirports() {
  const { company } = useCompany()
  const [search, setSearch] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selected, setSelected] = useState()
  const debounced = useDebounce(search, 700)

  const { data, isFetching, isError, error } = useSearchAirportQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })
  useEffect(() => {
    if (data) {
      setErrorMsg("")
      setDropdownOpen(debounced.length >= 3 && data?.airports.length! > 0)
    }
    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [data, error])

  return (
    <div
      className={`flex relative w-full rounded-full bg-slate-300 dark:bg-slate-700 shadow-md shadow-slate-700 transition-all duration-300 ease-out h-10`}
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

      {dropdownOpen && (
        <div className="absolute z-10 top-10 left-1 right-5 rounded-b-3xl max-h-80 overflow-y-scroll shadow-md shadow-slate-700 bg-slate-100 dark:bg-slate-800">
          <SearchDropdown
            items={data?.airports}
            setOpen={setDropdownOpen}
            selector={setSelected}
            dataView={["name", "iata"]}
          />
        </div>
      )}
    </div>
  )
}
