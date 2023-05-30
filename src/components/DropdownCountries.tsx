import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useActions } from "../hooks/actions"
import { useGetCountriesQuery } from "../store/auth/auth.api"
import { ICountry } from "../types/user.types"

interface IValue {
  id: number
  firstname: string
  lastname: string
  phone: string
  country: string
}

interface DropdownProps {
  value: IValue
  setValue: Dispatch<SetStateAction<IValue>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function DropdownCountries({ value, setValue, setOpen }: DropdownProps): JSX.Element {
  const { data } = useGetCountriesQuery("")
  const { updateCountry } = useActions()
  let newData: ICountry[] | undefined

  const [countriesList, setCountriesList] = useState<ICountry[] | undefined>([])

  useEffect(() => {
    setCountriesList(data)
  }, [data])

  //function for search countries by begin entered string matches to name or phone code---------------------

  const search = (searchStr: string) => {
    searchStr = searchStr.toLowerCase()
    newData = data!.filter((item) => {
      return (
        item.phonecode.toString().toLowerCase().startsWith(searchStr) ||
        item.title_case.toLowerCase().startsWith(searchStr)
      )
    })
    setCountriesList(newData)
  }

  const selectionHandler = (item: ICountry) => {
    setValue((value) => ({ ...value, country: item.iso }))
    updateCountry(item)
    setOpen((prev) => !prev)
  }

  return (
    <div className="absolute w-1/2 block z-10 top-14 rounded-b-md overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-200 dark:bg-slate-800">
      <div className="flex sticky top-0">
        <label htmlFor="input-country-search" className="sr-only">
          Country Search
        </label>
        <i className="absolute z-20 top-2.5 left-5 fas fa-magnifying-glass" />
        <input
          autoFocus
          onChange={(e) => search(e.target.value)}
          type="text"
          id="input-country-search"
          className="w-full p-1 pl-12 bg-slate-300 dark:bg-slate-700 rounded-full outline-none"
        />
      </div>
      <div className="max-h-56 pl-3 mt-1 overflow-x-hidden transition-all">
        <ul className="list-none">
          {countriesList?.map((item) => (
            <li
              key={item.iso}
              className="flex items-center py-1 text-base hover:bg-slate-600 hover:text-slate-300 cursor-pointer transition-colors"
              onClick={() => selectionHandler(item)}
            >
              <div className="w-1/5">
                <img alt="" src={`data:image/png;base64, ${item.flag}`} />
              </div>

              <span className="w-1/5 flex justify-end mr-2">{`+${item.phonecode}`}</span>
              <span className="w-3/5 text-ellipsis overflow-x-hidden whitespace-nowrap">{item.title_case}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
