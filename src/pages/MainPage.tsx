import { useEffect, useState } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useSearchAirportQuery } from "../store/airport/airport.api"
import Dropdown from "../components/DropdownData"
import { useDebounce } from "../hooks/debounce"
import { useAppSelector } from "../hooks/redux"
import { useActions } from "../hooks/actions"
import Search from "../components/Search"

export default function MainPage() {
  return (
    <div className="w-full mt-6 px-3 md:flex">
      <div className="w-full md:w-1/3 flex flex-col">
        <Search />
        <div className="w-full h-[500px] border border-slate-600 mt-2">MAP</div>
      </div>
      <div className="w-full md:w-2/3 flex flex-col md:px-2">
        <div className="w-full h-[400px] border border-slate-600 mt-2">
          <></>
        </div>
        <div className="w-full h-[300px] border border-slate-600 mt-2">Flight details</div>
      </div>
    </div>
  )
}
