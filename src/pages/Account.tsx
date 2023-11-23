import { useAuth } from "../hooks/useAuth"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from "react"
import { useSearchCompanyQuery, useCreateCompanyMutation } from "../store/company/company.api"
import { useDebounce } from "../hooks/debounce"
import SearchDropdown from "../components/SearchDropdown"
import CountriesDropdown from "../components/CountriesDropdown"
import { useActions } from "../hooks/actions"
import { useCompany } from "../hooks/useCompany"

export default function Account() {
  const { user } = useAuth()
  const { company } = useCompany()
  const { setUser, setCompany } = useActions()
  const [createCompanyQuery] = useCreateCompanyMutation()

  const [openCompaniesDropdown, setOpenCompaniesDropdown] = useState(false)
  const [openCountriesDropdown, setOpenCountriesDropdown] = useState(false)
  const debounced = useDebounce(company?.name ? company?.name : "", 700)

  const { data, isLoading, isError, error } = useSearchCompanyQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  })

  const [errorMsg, setErrorMsg] = useState("")

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompany({ ...company, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (company?.category === "supplier") setCompany({ ...company, iata: undefined, icao: undefined })
  }, [company?.category])

  useEffect(() => {
    if (data && data.total_count > 0) {
      setErrorMsg("")
      setOpenCompaniesDropdown(
        debounced.length >= 3 && data.companies.length > 0 && data.companies.every((co) => co.name !== company.name),
      )
    }
    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [data, error])

  async function companySave() {
    let res: {
      data: string
      company_id: number
    }
    if (user.role === "admin") {
      const { country, flag, currency, ...newCompany } = company
      res = await createCompanyQuery({ id: user.id, role: user.role, newCompany }).unwrap()
    } else {
      res = await createCompanyQuery({ id: user.id, role: user.role, company_id: company.id }).unwrap()
    }
    setUser({ ...user, company_id: res.company_id })
    setCompany({ ...company, id: res.company_id })
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-center text-3xl font-semibold my-2">
        <h1>ACCOUNT</h1>
      </div>
      <div className="block md:flex ">
        <div className="w-full md:w-5/12 flex justify-center text-slate-500">
          <div className="flex flex-col text-xl md:text-2xl">
            <h1 className="mb-4 font-bold text-3xl"> Your profile:</h1>
            <div className="flex mb-3">
              <h1 className="w-32">First name:</h1>
              <span className="font-bold text-slate-600 dark:text-slate-200">{user.firstname}</span>
            </div>
            <div className="flex mb-3">
              <h1 className="w-32">Last name:</h1>
              <span className="font-bold text-slate-600 dark:text-slate-200">{user.lastname}</span>
            </div>
            <div className="flex mb-3">
              <h1 className="w-32">Email:</h1>
              <span className="font-bold text-slate-600 dark:text-slate-200">{user.email}</span>
            </div>
            <div className="flex">
              <h1 className="w-32">Tel: </h1>
              <div className="flex items-center ">
                <img src={`data:image/png;base64, ${user.flag}`} alt="" className="pr-2" />
                <span className="font-bold text-slate-600 dark:text-slate-200">
                  +{user.phonecode}-{user.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 text-2xl p-2">
          <span className="text-slate-500 text-base md:text-xl">
            Please enter your company details or select a company from the list for further operations:
          </span>
          <div className="flex text-xl md:text-2xl items-center mt-4 text-slate-500">
            <div>
              <input
                type="radio"
                value="airline"
                checked={company?.category === "airline" ? true : false}
                onChange={onChange}
                name="category"
                id="airline"
                className="appearance-none w-5 h-5 hover:cursor-pointer border-2 border-gray-400 opacity-75 hover:opacity-100 checked:opacity-100 rounded-full checked:bg-teal-500 checked:border-slate-600 dark:checked:border-slate-300 peer"
              />
              <label
                htmlFor="airline"
                className="capitalize mr-6 ml-2 hover:cursor-pointer peer-checked:text-slate-600 dark:peer-checked:text-slate-200"
              >
                Airline
              </label>
            </div>
            <div>
              <input
                type="radio"
                value="supplier"
                checked={company?.category === "supplier" ? true : false}
                onChange={onChange}
                name="category"
                id="supplier"
                className="appearance-none w-5 h-5 hover:cursor-pointer border-2 border-gray-400 opacity-75 hover:opacity-100 checked:opacity-100 rounded-full checked:bg-teal-500 checked:border-slate-600 dark:checked:border-slate-300 peer"
              />
              <label
                htmlFor="supplier"
                className="capitalize mr-6 ml-2 hover:cursor-pointer peer-checked:text-slate-600 dark:peer-checked:text-slate-200"
              >
                Supplier
              </label>
            </div>
          </div>
          <div className="flex relative text-xl md:text-2xl items-end text-slate-500">
            <label htmlFor="name" className="capitalize w-1/2 mt-4 block">
              Company name:
            </label>
            <input
              id="name"
              autoComplete="off"
              name="name"
              type="text"
              autoFocus
              value={company?.name ?? ""}
              onChange={onChange}
              placeholder="Enter the company name or select from the dropdown list..."
              className="w-1/2 font-bold outline-none placeholder:text-base placeholder:font-normal text-slate-600 dark:text-slate-200 bg-transparent opacity-90 focus:placeholder:opacity-0 hover:opacity-100 focus:opacity-100 peer"
            />
            {openCompaniesDropdown && (
              <div className="absolute z-10 top-12 left-1/2 w-1/2 rounded-3xl max-h-80 overflow-y-scroll shadow-md shadow-slate-700 bg-slate-100 dark:bg-slate-800">
                <SearchDropdown
                  items={data?.companies}
                  setOpen={setOpenCompaniesDropdown}
                  selector={setCompany}
                  dataView={["name", "category"]}
                />
              </div>
            )}
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
          </div>

          <div className="flex relative text-xl md:text-2xl items-end text-slate-500">
            <label htmlFor="reg_number" className="capitalize w-1/2 mt-4 block">
              Registration number:
            </label>
            <input
              autoComplete="off"
              id="reg_number"
              name="reg_number"
              type="text"
              onChange={onChange}
              value={company?.reg_number ?? ""}
              placeholder="Company registration number..."
              className="w-1/2 font-bold outline-none placeholder:text-base placeholder:font-normal text-slate-600 dark:text-slate-200 bg-transparent opacity-90 focus:placeholder:opacity-0 hover:opacity-100 focus:opacity-100 peer"
            />
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
          </div>

          {company?.category === "airline" && (
            <div className="w-full text-slate-500">
              <div className="flex items-end relative text-xl md:text-2xl">
                <label htmlFor="iata" className="w-1/2 mt-4">
                  Airline IATA code:
                </label>
                <input
                  autoComplete="off"
                  id="iata"
                  name="iata"
                  type="text"
                  onChange={onChange}
                  value={company?.iata ?? ""}
                  placeholder="2-character IATA code..."
                  className="w-1/2 font-bold outline-none placeholder:text-base placeholder:font-normal text-slate-600 dark:text-slate-200 bg-transparent opacity-90 focus:placeholder:opacity-0 hover:opacity-100 focus:opacity-100 peer"
                />
                <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
              </div>
              <div className="flex items-end relative text-xl md:text-2xl">
                <label htmlFor="icao" className="w-1/2 mt-4">
                  Airline ICAO code:
                </label>
                <input
                  autoComplete="off"
                  id="icao"
                  name="icao"
                  type="text"
                  onChange={onChange}
                  value={company?.icao ?? ""}
                  placeholder="3-character ICAO code..."
                  className="w-1/2 font-bold outline-none placeholder:text-base placeholder:font-normal text-slate-600 dark:text-slate-200 bg-transparent opacity-90 focus:placeholder:opacity-0 hover:opacity-100 focus:opacity-100 peer"
                />
                <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
              </div>
            </div>
          )}

          <div className="flex items-end w-full text-xl md:text-2xl">
            <span className="flex w-1/2 mt-4 text-slate-500">Company registration country:</span>
            <div className="flex w-1/2 relative">
              <button
                type="button"
                className="items-end group text-slate-600 dark:text-slate-200 outline-none"
                onClick={() => setOpenCountriesDropdown((prev) => !prev)}
              >
                <div className="flex items-center">
                  <img src={`data:image/png;base64, ${company?.flag}`} alt="" />
                  <span className={`mr-4 ${company?.country ? "font-bold ml-4" : "font-normal text-base opacity-60"}`}>
                    {company?.country ? company?.country : "Find and select from the dropdown list..."}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down transition-all group-hover:opacity-100 group-focus:opacity-100 ${
                      openCountriesDropdown ? "rotate-180 opacity-100" : "rotate-0 opacity-0"
                    } ${company?.country && !openCountriesDropdown ? "rotate-0 opacity-0" : "rotate-0 opacity-60"}`}
                  />
                </div>
                <div className="absolute w-0 transition-all duration-300 ease-in-out border-slate-500 bottom-0 group-focus:w-full md:group-focus:w-full group-focus:border-b" />
              </button>

              {openCountriesDropdown && (
                <CountriesDropdown
                  style="absolute text-lg w-full md:w-1/2 block z-10 top-8 rounded-2xl overflow-y-scroll shadow-md dark:shadow-slate-600 bg-slate-200 dark:bg-slate-800"
                  state={company}
                  setCountry={setCompany}
                  setOpen={setOpenCountriesDropdown}
                  dialcode={false}
                  isocode={true}
                />
              )}
            </div>
          </div>

          {company && company.category && company.name && company.reg_number && company.country_iso && (
            <>
              <div className="flex items-end relative text-xl md:text-2xl text-slate-500">
                <label htmlFor="role" className="w-1/2 mt-4">
                  Your competency:
                </label>
                <select
                  name="role"
                  id="role"
                  defaultValue={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="outline-none font-bold appearance-none bg-transparent text-slate-600 dark:text-slate-200 opacity-90 hover:opacity-100 focus:opacity-100 peer"
                >
                  <option disabled={data && data?.total_count !== 0} value="admin" className="text-lg">
                    admin
                  </option>
                  <option disabled={!data || data?.total_count === 0} value="supervisor" className="text-lg">
                    supervisor
                  </option>
                  <option disabled={!data || data?.total_count === 0} value="staff" className="text-lg">
                    staff
                  </option>
                  <option disabled={!data || data?.total_count === 0} value="user" className="text-lg">
                    user
                  </option>
                </select>
                <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/2 md:left-1/2 border-slate-500 bottom-0 peer-focus:w-1/2 md:peer-focus:w-1/2 peer-focus:border-b" />
              </div>

              {user.role !== "user" && (
                <div className="w-full flex mt-4">
                  <div className="w-1/2 justify-end"></div>
                  <button
                    onClick={companySave}
                    className="px-4 py-1 text-base rounded-full bg-teal-400 dark:bg-teal-700 opacity-70 hover:opacity-100 active:scale-90"
                  >
                    {data?.total_count === 0 && (
                      <div className="flex items-center">
                        <i className="fas fa-plus mr-2" />
                        <span>CREATE</span>
                      </div>
                    )}
                    {data?.total_count !== 0 && (
                      <div className="flex items-center">
                        <i className="fas fa-download mr-2" />
                        <span>SAVE</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
              {user.role === "user" && (
                <div className="w-full flex mt-4 justify-end">
                  <span className="w-1/2 text-lg opacity-70">Change your role to create an account...</span>
                </div>
              )}
            </>
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
