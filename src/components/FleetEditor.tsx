import { ChangeEvent, useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"
import { IFleet } from "../types/airline.types"
import { handleDataFileInput } from "../services/datafile.loader"
import { useAuth } from "../hooks/useAuth"
import { useGetFleetQuery } from "../store/airline/airline.api"
import Table from "./Table"

const initialFleet = {
  id: 0,
  name: "",
  acType: "",
  acReg: "",
  seats: 0,
}

const headers = Object.keys(initialFleet).slice(1) as Array<keyof IFleet>

export default function FleetEditor() {
  const { user, country, company } = useAuth()
  const { data, error } = useGetFleetQuery({ id: company!.co_id })

  const [fleet, setFleet] = useState<IFleet[]>([initialFleet])
  const [editRow, setEditRow] = useState<IFleet>(initialFleet)
  const [errorMsg, setErrorMsg] = useState("")

  const handleEditFleet = (row: IFleet) => {
    setEditRow(row)
    console.log(row)

    setErrorMsg("")
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleDataFileInput(e, headers, setFleet)
    setFleet([initialFleet])
  }

  useEffect(() => {
    console.log(fleet)
  }, [fleet])

  // useEffect(() => {
  //   setFleet([initialFleet])
  //   setErrorMsg("")
  //   if (data && data.length != 0) setFleet(data)
  //   if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
  //   if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
  // }, [data, error])

  return (
    <div className="max-w-max max-h-max text-xl">
      <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>
      {/* {isLoading && (
          <div className="ml-48 mt-12">
            <LoadingSpinner />
          </div>
        )} */}
      <div className="flex flex-col lg:flex-row text-lg justify-between items-center">
        <div className="mb-2 lg:mb-1">
          <button
            onClick={() => handleEditFleet(initialFleet)}
            type="button"
            className="px-2.5 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
          >
            <i className="fas fa-plus mr-2" />
            <span>Add aircraft</span>
          </button>
        </div>

        <div className="mb-2 lg:mb-1">
          <label
            htmlFor="xlsxFileInput"
            className="px-2.5 py-1.5 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
          >
            <i className="fas fa-upload mr-2" />
            <span>Upload from file</span>
          </label>
          <input
            id="xlsxFileInput"
            name="xlsxFileInput"
            type="file"
            accept=".xlsx, .ods"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <Table headers={headers} data={fleet} setData={setFleet} handleEdit={handleEditFleet} />
    </div>
  )
}
