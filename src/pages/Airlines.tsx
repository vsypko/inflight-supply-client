import { ChangeEvent, useState } from "react"
import Table from "../components/Table"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import handleXLSXFileInput from "../services/flightdata.service"

export default function Airlines() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, token } = useAuth()
  const [data, setData] = useState<any[][]>([])

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    handleXLSXFileInput(e, setData)
  }

  return (
    <div>
      Airlines Page
      <div>{selected?.ap_country}</div>
      <div>{selected?.ap_municipality}</div>
      <div>{selected?.ap_name}</div>
      <div>{selected?.ap_iata_code}</div>
      <div>{user?.usr_email}</div>
      <div>{user?.usr_firstname}</div>
      <div>{user?.usr_lastname}</div>
      <div className="flex">
        <span>+{user?.usr_cn === "ZZ" ? "" : country?.cn_phonecode}</span>
        <span>-{user?.usr_phone}</span>
      </div>
      <div>role: {user?.usr_role_name}</div>
      {!data.length && (
        <div className="mt-2 flex">
          <label
            htmlFor="xlsxFileInput"
            className="p-2 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
          >
            <i className="fas fa-upload mr-2" />
            <span>Upload xlsx file</span>
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
      {data && data.length > 0 && (
        <>
          <div className="flex justify-left">
            <button type="button">Remove</button>
            <button type="button">Save</button>
          </div>
          <Table schedule={data} />
        </>
      )}
    </div>
  )
}
