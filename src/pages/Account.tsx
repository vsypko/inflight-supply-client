import { useAuth } from "../hooks/useAuth"
import { useGetUsersQuery } from "../store/users/users.api"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useEffect, useState } from "react"

export default function Account() {
  const { user, company, country } = useAuth()
  const { data, error, isError, isSuccess, isLoading } = useGetUsersQuery(
    { column: "company", value: user?.company },
    {
      skip: !user?.company,
    },
  )

  const [errorMsg, setErrorMsg] = useState("")
  useEffect(() => {
    setErrorMsg("")
    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [error])

  return (
    <div className="w-full">
      <div className="w-full flex justify-center text-2xl font-semibold mt-2">
        <h1>ACCOUNT</h1>
      </div>
      <div className="w-full md:w-1/3 p-2">
        <div className="border border-slate-600 flex flex-col text-2xl">
          <div className="flex justify-between m-2">
            <h1>First name:</h1>
            <span className="font-bold">{user?.firstname}</span>
          </div>
          <div className="flex justify-between m-2">
            <h1>Last name:</h1>
            <span className="font-bold">{user?.lastname}</span>
          </div>
          <div className="flex justify-between m-2">
            <h1>Email:</h1>
            <span className="font-bold">{user?.email}</span>
          </div>
          <div className="flex justify-between m-2">
            <h1>Tel: </h1>
            <div className="flex items-center">
              <img src={`data:image/png;base64, ${country?.flag}`} alt="" className="pr-2" />

              <span className="font-bold">
                +{country?.phonecode}-{user?.phone}
              </span>
            </div>
          </div>

          <div className="flex m-2 relative justify-between">
            <label htmlFor="company" className="capitalize">
              Company:
            </label>
            <textarea
              id="company"
              name="company"
              // onChange={onChange}
              value={company?.name}
              className={`w-full text-right border font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 peer`}
            />
            <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
          </div>

          <div className="flex justify-between m-2">
            <h1>Country:</h1>
            <div className="flex">
              <span className="font-bold mr-2">{company?.country.title_case}</span>
              <img src={`data:image/png;base64, ${company?.country.flag}`} alt="" className="py-1" />
            </div>
          </div>
          <div className="flex justify-between m-2">
            <h1>Competency:</h1>
            <span className="font-bold text-right">{user?.role}</span>
          </div>
        </div>
        {/* {company && (
          <div className="flex flex-col text-2xl mt-4">
            <h1>Company details:</h1>
            <div className="flex w-full text-2xl relative my-2">
              <label htmlFor="company" className="w-1/3 md:w-1/4 capitalize">
                Company:
              </label>
              <input
                id="company"
                type="text"
                name="company"
                // onChange={onChange}
                value={company?.name}
                className={`w-2/3 md:w-3/4 font-bold bg-transparent opacity-90 focus:outline-none hover:opacity-100 focus:opacity-100 peer`}
              />
              <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
            </div>

            <div className="flex text-2xl justify-between m-2">
              <span className="">Category:</span>
              <div className="">
                <input type="radio" id="airline" name="category" value="airline" checked className="hidden peer" />
                <label
                  htmlFor="airline"
                  className="cursor-pointer peer-checked:border-4 rounded-full px-3 opacity-60 peer-checked:border-slate-400 peer-checked:opacity-80 hover:opacity-100 active:scale-70"
                >
                  Airline
                </label>
              </div>
              <div>
                <input type="radio" id="supplier" name="category" value="supplier" className="hidden peer" />
                <label
                  htmlFor="supplier"
                  className="cursor-pointer peer-checked:border-4 rounded-full px-3 opacity-60 peer-checked:border-slate-400 peer-checked:opacity-80 hover:opacity-100 active:scale-70"
                >
                  Supplier
                </label>
              </div>
            </div>
            <div className="flex w-full text-xl relative my-2">
              <label htmlFor="company" className="w-1/3 md:w-1/4 capitalize font-semibold">
                Country:
              </label>
              <input
                id="country"
                type="text"
                name="country"
                // onChange={onChange}
                // value={
                //   key === "price" && typeof editRow[key] === "number" ? editRow[key].toFixed(2) : editRow[key]
                // }
                className={`w-2/3 md:w-3/4 bg-transparent opacity-70 focus:outline-none hover:opacity-100 focus:opacity-100 peer`}
              />

              <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
            </div>
          </div>
        )} */}
        {isSuccess && (
          <>
            <h1>TEAM:</h1>
            <ul>
              {data.users.map((user, index) => (
                <li key={user.id}>
                  <div className="flex">
                    <div className="mr-4">{index + 1}</div>
                    <div className="w-full">
                      <p>
                        Name: {user.firstname} {user.lastname}
                      </p>
                      <p>Competency: {user.role}</p>
                      <p>email: {user.email}</p>
                      {!company?.name && <p>Company: {user.company}</p>}
                      <hr className="border-slate-600" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {isError && <div className="text-red-500">{errorMsg}</div>}
        {isLoading && (
          <div className="mt-28">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}
