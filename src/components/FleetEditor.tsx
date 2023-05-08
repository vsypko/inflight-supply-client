import { ChangeEvent, useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"
import { IFleet } from "../types/airline.types"
import { handleDataFileInput } from "../services/datafile.loader"
import { useAuth } from "../hooks/useAuth"
import { useGetCompanyDataQuery, useInsertCompanyDataMutation } from "../store/company/company.api"
import Table from "./Table"
import SaveRemove from "./SaveRemove"
import Dialog from "./Dialog"

const initialFleet: IFleet = {
  id: 0,
  name: "",
  acType: "",
  acReg: "",
  seats: 0,
}

const headers = Object.keys(initialFleet).slice(1) as Array<keyof IFleet>

export default function FleetEditor() {
  const { user, country, company } = useAuth()
  const { data, error } = useGetCompanyDataQuery({ tbType: "fleet", tbName: company!.co_tb_1 })
  const [insertCompanyData, { data: response, isError, isSuccess, isLoading }] = useInsertCompanyDataMutation()

  // const [fleet, setFleet] = useState<IFleet[]>([initialFleet])
  const [newFleet, setNewFleet] = useState<IFleet[]>([])
  const [editRow, setEditRow] = useState<IFleet>(initialFleet)
  const [errorMsg, setErrorMsg] = useState("")
  const [dialogRef, setDialogRef] = useState<HTMLDialogElement | null>(null)
  const [result, setResult] = useState("")

  const handleEditFleet = (row: IFleet) => {
    setEditRow(row)
    setErrorMsg("")
    dialogRef?.showModal()
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleDataFileInput(e, headers, setNewFleet)
  }

  async function handleFleetInsert() {
    try {
      const values = newFleet.map((row) => `('${row.name}', '${row.acType}', '${row.acReg}', ${row.seats})`).join(",")
      await insertCompanyData({ tbType: "fleet", tbName: company!.co_tb_1, values }).unwrap()
      setNewFleet([])
    } catch (err) {
      setNewFleet([])
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  useEffect(() => {
    setErrorMsg("")
    if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
    if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
  }, [error])

  return (
    <>
      <Dialog<IFleet>
        row={editRow}
        setRow={setEditRow}
        setDialogRef={setDialogRef}
        setErrorMsg={setErrorMsg}
        setResult={setResult}
      />
      <div className="max-w-max max-h-max text-xl">
        {errorMsg && <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>}
        {isLoading && (
          <div className="ml-48 mt-12">
            <LoadingSpinner />
          </div>
        )}
        <div className="w-full">
          {!newFleet.length && !isLoading && (
            <div className="flex flex-col lg:flex-row text-lg justify-between items-center">
              <div className="mb-2 lg:mb-1">
                <button
                  onClick={() => handleEditFleet(initialFleet)}
                  type="button"
                  className="px-2.5 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
                >
                  <i className="fas fa-plus mr-2" />
                  <span>Add Aircraft</span>
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
          )}
          {newFleet.length != 0 && !isLoading && <SaveRemove setNew={setNewFleet} handleSave={handleFleetInsert} />}
          {newFleet.length != 0 && !isLoading && <Table headers={headers} data={newFleet} />}
          {data && !newFleet.length && !isLoading && (
            <Table headers={headers} data={data} handleEdit={handleEditFleet} />
          )}
          <div className="flex w-full m-1 h-6">
            {response && <h5 className="text-teal-500 py-1 whitespace-pre-line result">{response.data}</h5>}
          </div>
        </div>
      </div>
    </>
  )
}
