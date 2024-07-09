import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useGetCountriesQuery } from '../store/auth/auth.api'
import { Country, User } from '../types/user.types'
import { Company } from '../types/company.types'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

interface DropdownProps {
  style: string
  state: User | Company
  setCountry: ActionCreatorWithPayload<any>
  setOpen: Dispatch<SetStateAction<boolean>>
  dialcode: boolean
  isocode: boolean
}

export default function CountriesDropdown({
  style,
  state,
  setCountry,
  setOpen,
  dialcode,
  isocode,
}: DropdownProps): JSX.Element {
  const { data } = useGetCountriesQuery('')
  let newData: Country[] | undefined

  const [countriesList, setCountriesList] = useState<Country[] | undefined>([])

  useEffect(() => {
    setCountriesList(data)
  }, [data])

  //function for search countries by begin entered string matches to name or phone code---------------------

  const searchHandler = (searchStr: string) => {
    searchStr = searchStr.toLowerCase()
    newData = data!.filter((item) => {
      return (
        item.phonecode.toString().toLowerCase().startsWith(searchStr) ||
        item.title_case.toLowerCase().startsWith(searchStr)
      )
    })
    setCountriesList(newData)
  }

  const selectionHandler = (item: Country) => {
    setOpen((prev) => !prev)
    if (dialcode)
      setCountry({
        ...state,
        country_iso: item.iso,
        country: item.title_case,
        flag: item.flag,
        phonecode: item.phonecode,
        currency: item.currency,
      })
    if (!dialcode)
      setCountry({
        ...state,
        country_iso: item.iso,
        country: item.title_case,
        flag: item.flag,
        currency: item.currency,
      })
  }

  return (
    <div className={style}>
      <div className="flex relative">
        <label htmlFor="country" className="sr-only" />
        <i className="absolute z-20 top-2.5 left-3 fas fa-magnifying-glass" />
        <input
          autoFocus
          onChange={(e) => searchHandler(e.target.value)}
          type="text"
          id="country"
          className="w-full p-1 pl-12 bg-slate-300 dark:bg-slate-700 rounded-full outline-none"
        />
      </div>
      <div className="max-h-56 mt-1 overflow-x-hidden transition-all">
        <ul className="list-none">
          {countriesList?.map((item) => (
            <li
              key={item.iso}
              className="flex items-center py-1 px-1 text-base rounded-full hover:bg-slate-600 hover:text-slate-300 cursor-pointer transition-colors"
              onClick={() => selectionHandler(item)}
            >
              <img
                alt=""
                src={`data:image/png;base64, ${item.flag}`}
                className="flex w-[30px] justify-start"
              />
              {dialcode && (
                <span className="flex w-3/12 justify-end">{`+${item.phonecode}`}</span>
              )}
              <span
                className={`${
                  isocode ? 'w-8/12' : 'w-7/12'
                } pl-1 md:pl-4 justify-start text-ellipsis overflow-x-hidden whitespace-nowrap`}
              >
                {item.title_case}
              </span>
              {isocode && (
                <span className="flex w-2/12 justify-end">{item.iso}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
