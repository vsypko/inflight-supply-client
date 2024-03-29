import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { read, utils } from "xlsx"

export async function handleDataFileInput<T>(
  e: ChangeEvent<HTMLInputElement>,
  headers: string[],
  setData: Dispatch<SetStateAction<T[]>>,
  co_id: number | undefined,
  co_iata?: string | undefined,
): Promise<void> {
  e.preventDefault()
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
    const data = reader.result
    const wb = read(data, { type: "array" })
    const sheet: any[] = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      range: 1,
      header: headers,
    })

    sheet.forEach((row) => {
      if ("std" in sheet[0]) {
        row.std = timeConverter(row.std)
        row.sta = timeConverter(row.sta)
        row.co_iata = co_iata
      }
      row.co_id = co_id
    })
    setData(sheet as T[])
  }
}

function timeConverter(time: number): string {
  const convertedTime = new Date(time * 24.001 * 60 * 60 * 1000)
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
