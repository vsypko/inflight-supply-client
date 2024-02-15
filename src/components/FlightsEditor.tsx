import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import { handleDataFileInput } from '../services/datafile.loader'
import {
  useGetCompanyDataQuery,
  useInsertCompanyDataMutation,
} from '../store/company/company.api'
import { LoadingSpinner } from './LoadingSpinner'
import { Flight } from '../types/company.types'
import Chart from './Chart'
import SaveRemove from './SaveRemove'
import Dialog from './Dialog'
import { useCompany } from '../hooks/useCompany'
import DateInput from './DateInput'

export default function FlightsEditor() {
  const { company } = useCompany()
  const [date, setDate] = useState<Date | null>(new Date())
  const { data, error } = useGetCompanyDataQuery({
    type: 'flights',
    id: company.id,
    date: date?.toISOString().slice(0, 10),
  })

  const emptyRow = {
    id: 0,
    date: new Date().toISOString().slice(0, 10),
    flight: 0,
    type: '',
    reg: '',
    from: '',
    to: '',
    std: '',
    sta: '',
    seats: 0,
    co_id: company.id,
    co_iata: company.iata,
  }

  const headers = Object.keys(emptyRow).slice(1, 10)

  useEffect(() => {
    setErrorMsg('')
    if (error != null && typeof error === 'object' && 'data' in error)
      setErrorMsg(error.data as string)
    if (error != null && typeof error === 'object' && 'error' in error)
      setErrorMsg(error.error as string)
  }, [error])

  const [insertCompanyData, { data: response, isError, isSuccess, isLoading }] =
    useInsertCompanyDataMutation()

  const [newFlights, setNewFlights] = useState<Flight[]>([])
  const [row, setRow] = useState<Flight>(emptyRow)

  const [errorMsg, setErrorMsg] = useState('')
  const [dialogRef, setDialogRef] = useState<HTMLDialogElement | null>(null)
  const [result, setResult] = useState('')

  const handleEdit = (row: Flight) => {
    setRow(row)
    setErrorMsg('')
    setResult('')
    dialogRef?.showModal()
  }

  async function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg('')
    await handleDataFileInput(
      e,
      headers,
      setNewFlights,
      company.id,
      company.iata
    )
  }

  async function handleInsertFlights() {
    try {
      await insertCompanyData({ type: 'flights', values: newFlights }).unwrap()
      setNewFlights([])
    } catch (err) {
      setNewFlights([])
      if (err != null && typeof err === 'object' && 'data' in err)
        setErrorMsg(err.data as string)
      if (err != null && typeof err === 'object' && 'error' in err)
        setErrorMsg(err.error as string)
    }
  }

  return (
    <>
      <Dialog
        headers={headers}
        row={row}
        setRow={setRow}
        setDialogRef={setDialogRef}
        setErrorMsg={setErrorMsg}
        setResult={setResult}
        type="flights"
      />
      <div className="max-w-max max-h-max">
        {errorMsg && (
          <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>
        )}
        {isLoading && (
          <div className="ml-48 mt-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Date input and decrease - increase buttons------------------------------------ */}

        <div className="w-full">
          {!newFlights.length && !isLoading && (
            <div className="flex flex-col lg:flex-row text-lg justify-between items-center">
              <DateInput date={date} setDate={setDate} />

              {/* Add new flight button ----------------------------------------------------------------- */}

              <div className="mb-2 lg:mb-1">
                <button
                  onClick={() => handleEdit(emptyRow)}
                  type="button"
                  className="px-3 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-700 opacity-75 hover:opacity-100"
                >
                  <i className="fas fa-plus mr-2" />
                  <span>Add flight</span>
                </button>
              </div>

              {/* Upload file from .xlsx worksheet button ----------------------------------------------- */}

              <div className="mb-2 lg:mb-1">
                <label
                  htmlFor="xlsxFileInput"
                  className="px-3 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-700 opacity-75 hover:opacity-100"
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
                  onChange={(e) => handleUploadFile(e)}
                />
              </div>
            </div>
          )}

          {/* Save - Remove buttons for xlsx file upload-------------------------------------------------------- */}

          {newFlights.length !== 0 && !isLoading && (
            <SaveRemove
              setNew={setNewFlights}
              handleSave={handleInsertFlights}
            />
          )}

          {/* Table with flights from xlsx or from DB --------------------------------------------------------------*/}

          {newFlights.length !== 0 && !isLoading && (
            <Chart<Flight> headers={headers} rows={newFlights} />
          )}
          {data && !newFlights.length && !isLoading && (
            <Chart<Flight>
              headers={headers}
              rows={data}
              handleEdit={handleEdit}
            />
          )}

          {/* Queries result info -------------------------------------------------------*/}
          <div className="flex w-full m-1 h-6">
            {result && (
              <h5 className="text-teal-500 py-1 whitespace-pre-line result">
                {result}
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
