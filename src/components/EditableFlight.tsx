import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"
import { IFlight } from "../types/airline.types"
import { useDeleteFlightMutation, useLoadFlightsMutation } from "../store/airline/airline.api"
import { useAuth } from "../hooks/useAuth"

interface Props {
  children?: ReactNode
  row: IFlight
  setRow: Dispatch<SetStateAction<IFlight>>
  setDialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>
}
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

export default function EditableFlight(props: Props) {
  const { row, setRow, setDialogRef } = props
  const [errorMsg, setErrorMsg] = useState("")
  const { company } = useAuth()
  const [flightDeleteQuery] = useDeleteFlightMutation()
  const [loadFlights, { data: result, isError, isSuccess, isLoading }] = useLoadFlightsMutation()

  const types = ["date", "number", "text", "text", "text", "text", "time", "time", "number"]
  const icons = [
    "fa-calendar-day",
    "fa-ticket",
    "fa-plane-up",
    "fa-plane",
    "fa-plane-departure",
    "fa-plane-arrival",
    "fa-clock",
    "fa-clock",
    "fa-users-gear",
  ]
  const ref = useRef<HTMLDialogElement | null>(null)
  const closeEditFlight = () => {
    ref.current?.classList.add("close")
    ref.current?.addEventListener(
      "animationend",
      () => {
        ref.current?.classList.remove("close")
        ref.current?.close()
      },
      { once: true },
    )
  }

  useEffect(() => {
    if (row && row.date === "") {
      const formatedDate = new Date().toISOString().slice(0, 10)
      setRow((row) => ({ ...row, date: formatedDate }))
      setDialogRef(ref.current)
    }
  }, [row, ref])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRow((row) => ({ ...row, [event.target.name]: event.target.value }))
  }

  const handleAddFlight = async () => {
    try {
      const flight = `('${row.date}'::date, ${row.flight}, '${row.acType}','${row.acReg}','${row.from}','${row.to}', '${row.std}'::time, '${row.sta}'::time, ${row.seats})`
      const response = await loadFlights({ id: company!.co_id, values: flight }).unwrap()
    } catch (err) {
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  const handleDeleteFlight = () => {
    const answer = confirm("This flight will be deleted from flights!")
    if (answer) {
      flightDeleteQuery({ company_id: company!.co_id, flight_id: row.id })
      closeEditFlight()
    }
  }

  const renderedInput = (key: keyof IFlight, index: number) => {
    return (
      <input
        type={types[index]}
        name={key}
        value={row[key]}
        id={key}
        onChange={onChange}
        className="block w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
        placeholder=" "
      />
    )
  }

  return (
    <dialog
      ref={ref}
      className="edit p-2 mt-40 md:ml-32 md:w-1/3 rounded-lg bg-slate-200 dark:bg-slate-700 shadow-md shadow-slate-700 dark:shadow-slate-600 text-slate-800 dark:text-slate-200 backdrop:backdrop-blur-sm"
    >
      <p className="text-center font-medium mb-4">FLIGHT</p>

      {/* Flight's data add, change and delete form --------------------------------------------------*/}

      <form method="dialog">
        <div className="grid md:grid-cols-2 gap-8 md:gap-8 w-full">
          {(Object.keys(row) as Array<keyof IFlight>).slice(1).map((key, index) => (
            <div key={key} className="relative w-full">
              {/* For inputs with keys For and To need to be airports dataset ----------------------------------------------- */}

              {renderedInput(key, index)}
              <label
                htmlFor={key}
                className="absolute top-4 text-md text-slate-400 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90  origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-focus:scale-75 peer-focus:-translate-y-11"
              >
                <i className={`fas ${icons[index]} mr-2`} />
                <span className="capitalize">{key}</span>
              </label>
            </div>
          ))}
          <div className="flex text-sm justify-between text-slate-200">
            <button className="py-1 px-2 rounded-full bg-slate-600 opacity-70 hover:opacity-100 active:scale-90">
              <i className="fas fa-plane-circle-exclamation mr-2" />
              <span>CANCEL</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteFlight}
              className="py-1 px-2 rounded-full bg-red-600 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plane-circle-xmark mr-2" />
              <span>DELETE</span>
            </button>
            <button className="py-1 px-2 rounded-full bg-teal-700 opacity-70 hover:opacity-100 active:scale-90">
              <i className="fas fa-plane-circle-check mr-2" />
              <span>SAVE</span>
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
