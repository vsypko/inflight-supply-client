import { ChangeEvent, useState } from "react"
import Table from "../components/Table"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import handleXLSXFileInput from "../services/flightdata.service"
import { useAddScheduleMutation } from "../store/airline/airline.api"
import { isFetchBaseQueryError } from "../store/errorHelper"
import { LoadingSpinner } from "./LoadingSpinner"

export default function AdminAirline() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, company } = useAuth()
  const [schedule, setSchedule] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const [data, setData] = useState("")
  const [addScheduleQuery, { isError, isSuccess, isLoading }] = useAddScheduleMutation()

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleXLSXFileInput(e, setSchedule)
  }

  async function scheduleSaveHandler() {
    try {
      const values = schedule
        .map(
          (row) =>
            `('${row.date}', ${row.flight}, '${row.acType}','${row.acReg}','${row.from}','${row.to}', '${row.std}'::time, '${row.sta}'::time, ${row.seats})`,
        )
        .join(",")
      const result = await addScheduleQuery(values).unwrap()
      setData(result.data)

      setSchedule([])
    } catch (err) {
      setSchedule([])
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  return (
    <div>
      Admin Page
      <div>{selected?.ap_country}</div>
      <div>{selected?.ap_municipality}</div>
      <div>{selected?.ap_name}</div>
      <div>IATA Code: {selected?.ap_iata_code}</div>
      <div>
        {user?.usr_firstname} {user?.usr_lastname}
      </div>
      <div>{user?.usr_email}</div>
      <div className="flex">
        <span>+{user?.usr_cn === "ZZ" ? "" : country?.cn_phonecode}</span>
        <span>-{user?.usr_phone}</span>
      </div>
      <div>role: {user?.usr_role_name}</div>
      <div>Company: {company?.co_name}</div>
      <div>IATA Code: {company?.co_iata_code}</div>
      {isError && <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>}
      {isSuccess && <h5 className="text-teal-500 mb-2 whitespace-pre-line">{data}</h5>}
      {isLoading && (
        <div className="mt-10">
          <LoadingSpinner />
        </div>
      )}
      {!schedule.length && (
        <div className="mt-2 flex">
          <label
            htmlFor="xlsxFileInput"
            className="p-2 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
          >
            <i className="fas fa-upload mr-2" />
            <span>Upload airline schedule xlsx file</span>
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
      )}
      {schedule && schedule.length > 0 && (
        <>
          <div className="flex flex-col w-max">
            <div className="flex w-full justify-end mb-1">
              <button
                type="button"
                className="mr-6 px-2 py-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
              >
                <i className="fas fa-trash-can mr-2" />
                <span>Remove</span>
              </button>
              <button
                onClick={scheduleSaveHandler}
                type="button"
                className="px-2 py-1 rounded-full active:scale-90 bg-teal-500 dark:bg-teal-800 opacity-75 hover:opacity-100"
              >
                <i className="fas fa-download mr-2" />
                <span>Save</span>
              </button>
            </div>

            <Table schedule={schedule} />
          </div>
        </>
      )}
    </div>
  )
}
