import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useActions } from "../hooks/actions"
import { useGetCountriesQuery } from "../store/auth/auth.api"
import { ICountry } from "../types/user.types"

interface IValue {
  id: number
  firstname: string
  lastname: string
  phone: string
  cn: string
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
        item.cn_phonecode.toString().toLowerCase().startsWith(searchStr) ||
        item.cn_case_name.toLowerCase().startsWith(searchStr)
      )
    })
    setCountriesList(newData)
  }

  const selectionHandler = (item: ICountry) => {
    setValue((value) => ({ ...value, cn: item.cn_iso }))
    updateCountry(item)
    setOpen((prev) => !prev)
  }

  return (
    <div className="absolute w-1/2 block z-10 mr-12 mt-2 rounded-b-md  overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-200 dark:bg-slate-900">
      <div className="flex px-1 sticky top-0">
        <label htmlFor="input-country-search" className="sr-only">
          Country Search
        </label>
        <i className="absolute z-20 top-2.5 left-5 fas fa-magnifying-glass" />
        <input
          autoFocus
          onChange={(e) => search(e.target.value)}
          type="text"
          id="input-country-search"
          className="w-full p-1 pl-10 bg-slate-300 dark:bg-slate-700 rounded-full outline-none"
        />
      </div>
      <div className="max-h-48 pl-3 mt-1 overflow-x-hidden">
        <ul className="list-none">
          {countriesList?.map((item) => (
            <li
              key={item.cn_iso}
              className="flex py-2 text-sm hover:bg-slate-600 hover:text-slate-300 cursor-pointer transition-colors space-x-3"
              onClick={() => selectionHandler(item)}
            >
              <img alt="" src={`data:image/png;base64, ${item.cn_flag}`} />
              <span>{`+${item.cn_phonecode}`}</span>
              <span className="text-ellipsis overflow-x-hidden whitespace-nowrap">{item.cn_case_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
