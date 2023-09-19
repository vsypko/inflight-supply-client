import { useAuth } from "../hooks/useAuth"
import { useGetUsersQuery } from "../store/users/users.api"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ChangeEvent, useEffect, useState, KeyboardEvent } from "react"
import { useSearchCompanyQuery } from "../store/company/company.api"
import { useDebounce } from "../hooks/debounce"
import Dropdown from "../components/DropdownSearch"
import { useActions } from "../hooks/actions"

interface IAccountData {
  id: number
  name: string | ""
  reg_number: string | ""
  category: string | ""
}

export default function Account() {
  const { user, company, country } = useAuth()

  const initialAccountData: IAccountData = {
    id: company ? company.id : 0,
    name: company ? company.name : "",
    reg_number: company ? company.reg_number : "",
    category: company ? company.category : "airline",
  }

  const [account, setAccount] = useState<IAccountData>(initialAccountData)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    //clear the company data if the name field is empty----------------------------------------------------------------
    if (event.target.name === "name" && event.target.value === "") setAccount(initialAccountData)

    //set a certain state field with the entered data------------------------------------------------------------------
    setAccount((account) => ({ ...account, [event.target.name]: event.target.value }))

    //set all state fields if exists-----------------------------------------------------------------------------------
    // companies.forEach((item) => {
    //   if (item.name === event.target.value) setAccount(item)
    // })
  }

  const clickHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "ArrowDown") console.log(e.code)
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const debounced = useDebounce(account.name, 700)
  const { updateUserCompany } = useActions()

  const { data, isLoading, isError, error } = useSearchCompanyQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    setErrorMsg("")
    setDropdownOpen(debounced.length >= 3 && data?.companies.length! > 0)

    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [data, error])

  return (
    <div className="w-full">
      <div className="w-full flex justify-center text-2xl font-semibold mt-2">
        <h1>ACCOUNT</h1>
      </div>

      <div className="block md:flex">
        <div className="w-full md:w-1/2 flex justify-center p-4">
          <div className="flex flex-col text-xl md:text-2xl">
            <div className="flex">
              <h1 className="w-32">First name:</h1>
              <span className="font-bold">{user?.firstname}</span>
            </div>
            <div className="flex">
              <h1 className="w-32">Last name:</h1>
              <span className="font-bold">{user?.lastname}</span>
            </div>
            <div className="flex">
              <h1 className="w-32">Email:</h1>
              <span className="font-bold">{user?.email}</span>
            </div>
            <div className="flex">
              <h1 className="w-32">Tel: </h1>
              <div className="flex items-center">
                <img src={`data:image/png;base64, ${country?.flag}`} alt="" className="pr-2" />

                <span className="font-bold">
                  +{country?.phonecode}-{user?.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 text-2xl p-4">
          <span className="text-slate-500">
            Please enter your company details or select a company from the list for further operations:
          </span>

          <div className="flex relative text-xl md:text-2xl" onKeyDown={(e) => clickHandler(e)}>
            <label htmlFor="company" className="capitalize w-1/3 md:w-1/4 mt-4 block">
              Company name:
            </label>
            <input
              id="name"
              autoComplete="off"
              autoFocus
              name="name"
              type="text"
              list="companiesList"
              onChange={onChange}
              value={account.name}
              className="w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 peer"
            />
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
            {/* <datalist id="companiesList" className="text-2xl">
              {data?.companies.map((item) => (
                <option key={item.id} value={item.name} className="appearance-none w-20 text-2xl" />
              ))}
            </datalist> */}
            {dropdownOpen && data && (
              <div className="absolute top-12 left-56 w-2/3 md:w-3/4">
                <Dropdown
                  items={data.companies}
                  setOpen={setDropdownOpen}
                  selector={updateUserCompany}
                  dataView={["name"]}
                  setSearch={setAccount}
                />
              </div>
            )}
          </div>

          <div className="flex relative text-xl md:text-2xl">
            <label htmlFor="reg" className="capitalize w-1/3 md:w-1/4 mt-4">
              Registration number:
            </label>
            <input
              autoComplete="off"
              id="reg_number"
              name="reg_number"
              type="text"
              onChange={onChange}
              value={account.reg_number}
              className="w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 peer relative"
            />
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
          </div>

          <div className="flex text-xl md:text-2xl items-center mt-4">
            <input
              type="radio"
              value="airline"
              checked={account.category === "airline"}
              onChange={onChange}
              name="category"
              id="airline"
              className="appearance-none w-5 h-5 hover:cursor-pointer border-2 border-gray-400 opacity-75 hover:opacity-100 checked:opacity-100 rounded-full checked:bg-teal-500 checked:border-slate-600 dark:checked:border-slate-300"
              // className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="airline" className="capitalize mr-6 ml-2 hover:cursor-pointer">
              Airline
            </label>

            <input
              type="radio"
              value="supplyer"
              checked={account.category === "supplier"}
              onChange={onChange}
              name="category"
              id="supplyer"
              className="appearance-none w-5 h-5 hover:cursor-pointer border-2 border-gray-400 opacity-75 hover:opacity-100 checked:opacity-100 rounded-full checked:bg-teal-500 checked:border-slate-600 dark:checked:border-slate-300"
            />
            <label htmlFor="supplyer" className="capitalize mr-6 ml-2 hover:cursor-pointer">
              Supplier
            </label>
          </div>
        </div>
      </div>
      {isError && <div className="text-red-500">{errorMsg}</div>}
      {isLoading && (
        <div className="mt-28">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
