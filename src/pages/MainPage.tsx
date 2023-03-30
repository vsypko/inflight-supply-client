import { useEffect, useState } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useSearchAirportQuery } from "../store/airport/airport.api"
import Dropdown from "../components/DropdownData"
import { useDebounce } from "../hooks/debounce"
import { useAppSelector } from "../hooks/redux"
import { useActions } from "../hooks/actions"

export default function MainPage() {
  const [search, setSearch] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [mountDelay, setMountDelay] = useState(false)
  const { selected } = useAppSelector((state) => state.airport)

  const { unselectAirport } = useActions()
  const debounced = useDebounce(search, 700)

  const { isLoading, data, isError, error } = useSearchAirportQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const unselectHandler = () => {
    setSearch("")
    unselectAirport()
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
  }, [debounced, data, error])

  useEffect(() => {
    setTimeout(() => {
      setMountDelay(!selected)
    }, 150)
  }, [selected])

  return (
    <div className="w-full mt-6 px-3 lg:px-0 md:ml-6 md:w-1/3 flex flex-col justify-between">
      <button
        className={
          "absolute p-3 fas fa-magnifying-glass rounded-full bg-slate-300 dark:bg-slate-700 opacity-70" +
          (!selected ? "" : " hover:opacity-100")
        }
        onClick={unselectHandler}
        disabled={!selected}
      />
      {mountDelay && (
        <form
          className={`bg-slate-300 dark:bg-slate-700 rounded-full ${!mountDelay ? " w-10" : " transition-all w-full"} ${
            !selected ? "" : " transition-all w-10"
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
            className="p-2 ml-11 bg-transparent outline-none w-11/12 text-xl leading-none"
            id="airport"
          />
        </form>
      )}
      {!mountDelay && (
        <div
          className={`flex pl-14 mt-2 justify-between items-center text-xl h-8 ${
            selected ? "transition-all w-full" : " transition-all w-0"
          }`}
        >
          <h1 className="uppercase">{selected?.ap_name}</h1>
          <h1 className="pl-1 font-bold">{selected?.ap_iata_code}</h1>
        </div>
      )}
      {dropdownOpen && <Dropdown items={data?.airports} setSelected={setSearch} setOpen={setDropdownOpen} />}
      {isError && <div className="text-red-500">{errorMsg}</div>}
      {isLoading && (
        <div className="mt-28">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
