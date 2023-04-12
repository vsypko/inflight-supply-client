import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { read, utils } from "xlsx"
import { IFlight } from "../types/airline.types"

export async function handleXLSXFileInput(
  e: ChangeEvent<HTMLInputElement>,
  setData: Dispatch<SetStateAction<IFlight[]>>,
): Promise<void> {
  e.preventDefault()
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()

  reader.onloadend = () => {
    const data = reader.result
    const wb = read(data, { type: "array" })
    const sheet: any[] = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      range: 8,
      header: ["date", "flight", "acType", "acReg", "from", "to", "std", "sta", "seats"],
    })
    sheet.forEach((row) => {
      row.std = timeConverter(row.std)
      row.sta = timeConverter(row.sta)
    })
    setData(sheet as IFlight[])
  }
  reader.readAsArrayBuffer(file)
}

function timeConverter(time: number): string {
  const convertedTime = new Date(time * 24 * 60 * 60 * 1000)
  const hours =
    convertedTime.getUTCHours() < 10
      ? "0" + convertedTime.getUTCHours().toString()
      : convertedTime.getUTCHours().toString()
  const minutes =
    convertedTime.getUTCMinutes() < 10
      ? "0" + convertedTime.getUTCMinutes().toString()
      : convertedTime.getUTCMinutes().toString()
  return hours + ":" + minutes
}
