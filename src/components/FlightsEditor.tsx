import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import { handleXLSXFileInput } from "../services/flightdata.service"
import { useGetFlightsQuery, useLoadFlightsMutation } from "../store/airline/airline.api"
import { LoadingSpinner } from "./LoadingSpinner"
import { IFlight } from "../types/airline.types"
import TableFlights from "./TableFlights"
import EditableFlight from "./EditableFlight"

const initialFlights = {
  id: 0,
  date: "",
  flight: 0,
  acType: "",
  acReg: "",
  from: "",
  to: "",
  std: "",
  sta: "",
  seats: 0,
}
export default function FlightsEditor() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, company } = useAuth()

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [flights, setFlights] = useState<IFlight[]>([initialFlights])
  const [newFlights, setNewFlights] = useState<IFlight[]>([])

  const [errorMsg, setErrorMsg] = useState("")
  const [result, setResult] = useState("")

  const [loadFlights, { data: response, isError, isSuccess, isLoading }] = useLoadFlightsMutation()
  const { data, error } = useGetFlightsQuery({ id: company!.co_id, date })

  useEffect(() => {
    setFlights([initialFlights])
    setErrorMsg("")
    if (data && data.length != 0) setFlights(data)
    if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
    if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    if (response) setResult(response.data)
  }, [data, error, isSuccess, response])

  function handleDecreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() - 0)
        .toISOString()
        .slice(0, 10),
    )
  }

  function handleIncreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() + 2, 0)
        .toISOString()
        .slice(0, 10),
    )
  }

  const [editRow, setEditRow] = useState<IFlight>(initialFlights)
  const [dialogRef, setDialogRef] = useState<HTMLDialogElement | null>(null)

  const handleEditFlight = (row: IFlight) => {
    setEditRow(row)
    if (row.date === "") setEditRow((prev) => ({ ...prev, date }))
    setErrorMsg("")
    setResult("")
    dialogRef?.showModal()
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleXLSXFileInput(e, setNewFlights)
  }

  async function handleFlightsInsert() {
    try {
      const values = newFlights
        .map(
          (row) =>
            `('${row.date}'::date, ${row.flight}, '${row.acType}','${row.acReg}','${row.from}','${row.to}', '${row.std}'::time, '${row.sta}'::time, ${row.seats})`,
        )
        .join(",")
      await loadFlights({ id: company!.co_id, values }).unwrap()
      setNewFlights([])
    } catch (err) {
      setNewFlights([])
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  return (
    <>
      <EditableFlight
        row={editRow}
        setRow={setEditRow}
        setDialogRef={setDialogRef}
        setErrorMsg={setErrorMsg}
        setResult={setResult}
      />
      <div className="max-w-max justify-center max-h-max">
        <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>
        {isLoading && (
          <div className="ml-48 mt-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Date input and decrease - increase buttons------------------------------------ */}

        <div className="w-full">
          {!newFlights.length && !isLoading && (
            <div className="flex flex-col lg:flex-row text-lg justify-between items-center">
              <div className="mb-2 lg:mb-1">
                <button
                  type="button"
                  className="px-2.5 py-1 opacity-75 hover:opacity-100 hover:bg-slate-700 rounded-full active:scale-90"
                  onClick={handleDecreaseDate}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <label className="mx-2">
                  <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent"
                  />
                </label>
                <button
                  type="button"
                  className="px-2.5 py-1 opacity-75 hover:opacity-100 hover:bg-slate-700 rounded-full active:scale-90"
                  onClick={handleIncreaseDate}
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>

              {/* Add new flight button ----------------------------------------------------------------- */}

              <div className="mb-2 lg:mb-1">
                <button
                  onClick={() => handleEditFlight(initialFlights)}
                  type="button"
                  className="px-2.5 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
                >
                  <i className="fas fa-plus mr-2" />
                  <span>Add flight</span>
                </button>
              </div>

              {/* Upload file from .xlsx worksheet button ----------------------------------------------- */}

              <div className="mb-2 lg:mb-1">
                <label
                  htmlFor="xlsxFileInput"
                  className="px-2.5 py-1.5 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
                >
                  <i className="fas fa-upload mr-2" />
                  <span>Upload from .xlsx file</span>
                </label>
                <input
                  id="xlsxFileInput"
                  name="xlsxFileInput"
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}

          {/* Save - Remove buttons for xlsx file upload-------------------------------------------------------- */}

          {newFlights.length != 0 && !isLoading && (
            <div className="flex w-full justify-end mb-1">
              <button
                onClick={() => setNewFlights([])}
                type="button"
                className="mr-6 px-2 py-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
              >
                <i className="fas fa-trash-can mr-2" />
                <span>Remove</span>
              </button>
              <button
                onClick={handleFlightsInsert}
                type="button"
                className="px-2 py-1 rounded-full active:scale-90 bg-teal-500 dark:bg-teal-800 opacity-75 hover:opacity-100"
              >
                <i className="fas fa-download mr-2" />
                <span>Save</span>
              </button>
            </div>
          )}

          {/* Table with flights from xlsx or from DB --------------------------------------------------------------*/}

          {newFlights.length != 0 && !isLoading && <TableFlights flights={newFlights} />}
          {flights && !newFlights.length && !isLoading && (
            <TableFlights flights={flights} setFlights={setFlights} handleEditFlight={handleEditFlight} />
          )}

          {/* xlsx file loading result -------------------------------------------------------*/}
          <div className="flex w-full m-1 h-6">
            {result && <h5 className="text-teal-500 py-1 whitespace-pre-line result">{result}</h5>}
          </div>
        </div>
      </div>
    </>
  )
}
