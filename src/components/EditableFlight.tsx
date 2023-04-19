import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  MouseEvent,
} from "react"
import { IFlight } from "../types/airline.types"
import { useDeleteFlightMutation, useLoadFlightsMutation, useUpdateFlightMutation } from "../store/airline/airline.api"
import { useAuth } from "../hooks/useAuth"

interface Props {
  children?: ReactNode
  row: IFlight
  setRow: Dispatch<SetStateAction<IFlight>>
  setDialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>
  setErrorMsg: Dispatch<SetStateAction<string>>
  setResult: Dispatch<SetStateAction<string>>
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
  const { row, setRow, setDialogRef, setErrorMsg, setResult } = props
  const { company } = useAuth()
  const [flightDeleteQuery] = useDeleteFlightMutation()
  const [loadFlights] = useLoadFlightsMutation()
  const [updateFlight] = useUpdateFlightMutation()

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

  const closeEditFlight = (
    e:
      | SyntheticEvent<HTMLDialogElement, Event>
      | FormEvent<HTMLFormElement>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault()
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

  const handleUpdateFlight = async (
    e:
      | SyntheticEvent<HTMLDialogElement, Event>
      | FormEvent<HTMLFormElement>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault()
    try {
      const response = await updateFlight({ id: company!.co_id, flight: row }).unwrap()
      setResult(response.data)
      closeEditFlight(e)
    } catch (err) {
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
      closeEditFlight(e)
    }
  }

  const handleAddFlight = async (
    e:
      | SyntheticEvent<HTMLDialogElement, Event>
      | FormEvent<HTMLFormElement>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault()
    try {
      const flight = `('${row.date}'::date, ${row.flight}, '${row.acType}','${row.acReg}','${row.from}','${row.to}', '${row.std}'::time, '${row.sta}'::time, ${row.seats})`
      const response = await loadFlights({ id: company!.co_id, values: flight }).unwrap()
      setResult(response.data)
      closeEditFlight(e)
    } catch (err) {
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
      closeEditFlight(e)
    }
  }

  const handleDeleteFlight = async (
    e:
      | SyntheticEvent<HTMLDialogElement, Event>
      | FormEvent<HTMLFormElement>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault()
    const answer = confirm("This flight will be deleted from flights!")
    try {
      if (answer) {
        const response = await flightDeleteQuery({ company_id: company!.co_id, flight_id: row.id }).unwrap()
        setResult(response.data)
        closeEditFlight(e)
      }
    } catch (err) {
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  const renderedInput = (key: keyof IFlight, index: number) => {
    return (
      <input
        autoFocus={index === 0}
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
      onCancel={(e) => closeEditFlight(e)}
      ref={ref}
      className="edit rounded-lg p-0 bg-slate-200 dark:bg-slate-700 shadow-md shadow-slate-700 dark:shadow-slate-600 text-slate-800 dark:text-slate-200"
    >
      <div className="flex justify-between rounded-t p-2 items-center text-lg dark:bg-slate-800 bg-slate-300">
        <p className="font-medium pl-4">FLIGHT</p>
        <button
          onClick={(e) => closeEditFlight(e)}
          className="active:scale-90 hover:bg-slate-700 py-1 px-3 rounded-full"
        >
          <i className="fas fa-xmark text-2xl" />
        </button>
      </div>

      {/* Flight's data add, change and delete form --------------------------------------------------*/}

      <form method="dialog" onSubmit={(e) => handleAddFlight(e)}>
        <div className="grid md:grid-cols-2 gap-8 md:gap-8 w-full p-3 mt-6">
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
          <div className={`flex text-sm ${row.id != 0 ? "justify-between" : "justify-end"} text-slate-200`}>
            {row.id != 0 && (
              <button
                onClick={(e) => handleUpdateFlight(e)}
                type="button"
                className="py-1 px-2 rounded-full bg-slate-600 opacity-75 hover:opacity-100 active:scale-90"
              >
                <i className="fas fa-rotate mr-2" />
                <span>UPDATE</span>
              </button>
            )}
            {row.id != 0 && (
              <button
                disabled={!row.id}
                type="button"
                onClick={(e) => handleDeleteFlight(e)}
                className="py-1 px-2 mx-1 rounded-full bg-red-600 opacity-75 hover:opacity-100 active:scale-90"
              >
                <i className="fas fa-trash-can mr-2" />
                <span>DELETE</span>
              </button>
            )}
            <button
              type="submit"
              className="py-1 px-2 rounded-full bg-teal-700 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plus mr-2" />
              <span>NEW</span>
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
