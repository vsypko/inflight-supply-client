import { useAuth } from "../hooks/useAuth"
import { useGetUsersQuery } from "../store/users/users.api"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from "react"
import { useSearchCompanyQuery } from "../store/company/company.api"
import { useDebounce } from "../hooks/debounce"
import Dropdown from "../components/DropdownSearch"
import DropdownCountries from "../components/DropdownCountries"
import { useActions } from "../hooks/actions"
import { ICountry } from "../types/user.types"

interface IAccountData {
  id: number
  name: string | ""
  reg_number: string | ""
  category: string | ""
  iata: string | undefined
  icao: string | undefined
  country: ICountry | undefined
  role: string | ""
}

export default function Account() {
  const { user, company, country } = useAuth()

  const initialAccountData: IAccountData = {
    id: company ? company.id : 0,
    name: company ? company.name : "",
    reg_number: company ? company.reg_number : "",
    category: company ? company.category : "airline",
    iata: company?.iata ? company.iata : undefined,
    icao: company?.icao ? company.icao : undefined,
    country: company?.country ? company.country : undefined,
    role: user?.role ? user.role : "",
  }

  const [account, setAccount] = useState<IAccountData>(initialAccountData)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    //clear the company data if the name field is empty----------------------------------------------------------------
    if (event.target.name === "name" && event.target.value === "") setAccount(initialAccountData)

    //set a certain state field with the entered data------------------------------------------------------------------
    setAccount((account) => ({ ...account, [event.target.name]: event.target.value }))
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false)
  const debounced = useDebounce(account.name, 700)
  const { updateUserCompany } = useActions()

  const { data, isLoading, isError, error } = useSearchCompanyQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (data) {
      setErrorMsg("")
      setDropdownOpen(debounced.length >= 3 && data.companies.length! > 0 && account.name !== company?.name)
    }

    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [data, error])

  return (
    <div className="w-full">
      <div className="w-full flex justify-center text-3xl font-semibold mt-2">
        <h1>ACCOUNT</h1>
      </div>
      <div className="block md:flex">
        <div className="w-full md:w-1/2 flex justify-center p-4">
          <div className="flex flex-col text-xl md:text-2xl">
            <h1 className="mb-4 font-bold text-3xl"> Your profile:</h1>
            <div className="flex mb-4">
              <h1 className="w-32">First name:</h1>
              <span className="font-bold">{user?.firstname}</span>
            </div>
            <div className="flex mb-4">
              <h1 className="w-32">Last name:</h1>
              <span className="font-bold">{user?.lastname}</span>
            </div>
            <div className="flex mb-4">
              <h1 className="w-32">Email:</h1>
              <span className="font-bold">{user?.email}</span>
            </div>
            <div className="flex mb-4">
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

          <div className="flex relative text-xl md:text-2xl items-end">
            <label htmlFor="name" className="capitalize w-1/3 md:w-1/4 mt-4 block">
              Company name:
            </label>
            <input
              id="name"
              autoComplete="off"
              name="name"
              type="text"
              autoFocus
              onChange={onChange}
              onClick={() => setDropdownOpen(false)}
              value={account.name}
              className="w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 ml-2 peer"
            />
            {dropdownOpen && (
              <div className="absolute z-10 top-20 md:top-12 left-28 md:right-12 md:left-60 rounded-b-md max-h-80 overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-400 dark:bg-slate-800">
                <Dropdown
                  items={data?.companies}
                  setOpen={setDropdownOpen}
                  selector={updateUserCompany}
                  dataView={["name"]}
                  setSearch={setAccount}
                />
              </div>
            )}
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
          </div>

          <div className="flex relative text-xl md:text-2xl items-end">
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
              className="w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 ml-2 peer"
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
              value="supplier"
              checked={account.category === "supplier"}
              onChange={onChange}
              name="category"
              id="supplier"
              className="appearance-none w-5 h-5 hover:cursor-pointer border-2 border-gray-400 opacity-75 hover:opacity-100 checked:opacity-100 rounded-full checked:bg-teal-500 checked:border-slate-600 dark:checked:border-slate-300"
            />
            <label htmlFor="supplier" className="capitalize mr-6 ml-2 hover:cursor-pointer">
              Supplier
            </label>
          </div>

          {account.category === "airline" && (
            <div className="flex w-full">
              <div className="flex w-1/2 items-end relative text-xl md:text-2xl">
                <label htmlFor="iata" className="w-1/2 mt-4">
                  Airline IATA code:
                </label>
                <input
                  autoComplete="off"
                  id="iata"
                  name="iata"
                  type="text"
                  onChange={onChange}
                  value={account.iata}
                  className="w-1/2 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 ml-2 peer"
                />
                <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
              </div>
              <div className="flex w-1/2 items-end relative text-xl md:text-2xl">
                <label htmlFor="icao" className="w-1/2 mt-4">
                  Airline ICAO code:
                </label>
                <input
                  autoComplete="off"
                  id="icao"
                  name="icao"
                  type="text"
                  onChange={onChange}
                  value={account.icao}
                  className="w-1/2 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 ml-2 peer"
                />
                <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
              </div>
            </div>
          )}

          <div className="flex relative text-xl md:text-2xl items-end">
            <span className="w-1/2 mt-4">Company registration country:</span>
            <button
              type="button"
              className="flex items-center text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:group-hover:text-slate-200 dark:peer-focus:text-slate-200"
              onClick={() => setOpenCountryDropdown((prev) => !prev)}
            >
              <img src={`data:image/png;base64, ${account.country?.flag}`} alt="" className="mr-4" />
              <span className="mr-4">{account.country!.title_case}</span>
              <i
                className={`fa-solid fa-chevron-down transition-all ${openCountryDropdown ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {openCountryDropdown && (
              <DropdownCountries
                style="absolute w-1/2 block z-10 left-[28rem] top-12 rounded-2xl overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-200 dark:bg-slate-800"
                value={account}
                setValue={setAccount}
                setOpen={setOpenCountryDropdown}
                dialcode={false}
                isocode={true}
              />
            )}
          </div>

          {/* <input
              type="text"
              name="country"
              id="country"
              value={account.country?.title_case}
              onChange={onChange}
              // pattern="[0-9]{2}-[0-9]{3}-[0-9]{4}"
              className="mt-6 ml-8 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
              placeholder=""
            />
            <label
              htmlFor="country"
              className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-100 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-focus:scale-75 peer-focus:-translate-y-12"
            >
              <span>Country:</span>
            </label> */}
          {/* </div> */}

          <div className="flex items-end relative text-xl md:text-2xl">
            <label htmlFor="role" className="w-1/3 md:w-1/4 mt-4">
              Your competency:
            </label>

            <input
              autoComplete="off"
              id="role"
              name="role"
              type="text"
              onChange={onChange}
              value={account.role}
              className="w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 mt-4 ml-2 peer"
            />
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
          </div>

          {company && company.name !== account.name && (
            <div className="mt-4 text-slate-500">
              Such company
              <span className="font-bold text-slate-600 dark:text-slate-400">{" '" + account.name + "' "}</span>
              has not yet been registered.
              <br /> It can be registered with the approval of a super admin and your competency will be registered as
              an admin.
              <br /> Would you like to submit a registration request?
            </div>
          )}
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
