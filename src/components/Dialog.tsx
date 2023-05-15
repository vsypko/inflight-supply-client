import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  MouseEvent,
  useState,
} from "react"

import {
  useDeleteCompanyDataMutation,
  useInsertCompanyDataMutation,
  useUpdateCompanyDataMutation,
} from "../store/company/company.api"
import { useAuth } from "../hooks/useAuth"
import { IAddPayload, IDeletePayload, IRow, IUpdatePayload } from "../types/airline.types"

interface Props<T> {
  row: T
  setRow: Dispatch<SetStateAction<T>>
  setDialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>
  setErrorMsg: Dispatch<SetStateAction<string>>
  setResult: Dispatch<SetStateAction<string>>
}

type EventDataEdit =
  | SyntheticEvent<HTMLDialogElement, Event>
  | FormEvent<HTMLFormElement>
  | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>

export default function Dialog<T extends IRow>(props: Props<T>): JSX.Element {
  const { row, setRow, setDialogRef, setErrorMsg, setResult } = props
  const { company } = useAuth()
  const [deleteDataQuery] = useDeleteCompanyDataMutation()
  const [insertDataQuery] = useInsertCompanyDataMutation()
  const [updateDataQuery] = useUpdateCompanyDataMutation()

  const [inputTypes, setInputTypes] = useState<string[]>([""])
  const [icons, setIcons] = useState<string[]>([""])
  const [updatePayload, setUpdatePayload] = useState<IUpdatePayload<T>>({ tbType: "", tbName: "", value: null })
  const [addPayload, setAddPayload] = useState<IAddPayload>({ tbType: "", tbName: "", values: "" })
  const [deletePayload, setDeletePayload] = useState<IDeletePayload>({ tbType: "", tbName: "", id: 0 })
  const ref = useRef<HTMLDialogElement | null>(null)

  const handleError = (err: any): void => {
    setErrorMsg("")
    if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
    if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
  }
  useEffect(() => {
    setDialogRef(ref.current)
  }, [ref])

  useEffect(() => {
    if (row && typeof row === "object" && "date" in row) {
      setInputTypes(["date", "number", "text", "text", "text", "text", "time", "time", "number"])
      setIcons([
        "fas fa-calendar-day",
        "fas fa-ticket",
        "fas fa-plane-up",
        "fas fa-plane",
        "fas fa-plane-departure",
        "fas fa-plane-arrival",
        "fas fa-clock",
        "fas fa-clock",
        "fas fa-users-gear",
      ])
      if (row.date === "") {
        const formatedDate = new Date().toISOString().slice(0, 10)
        setRow((row) => ({ ...row, date: formatedDate }))
      }
      setUpdatePayload({ tbType: "flight", tbName: company!.co_tb_2, value: row })
      const data = `('${row.date}', ${row.flight}, '${row.type}', '${row.reg}', '${row.from}', '${row.to}', '${row.std}', '${row.sta}', ${row.seats})`
      setAddPayload({ tbType: "flights", tbName: company!.co_tb_2, values: data })
      setDeletePayload({ tbType: "flight", tbName: company!.co_tb_2, id: row.id })
    } else {
      setInputTypes(["text", "text", "text", "number"])
      setIcons(["fas fa-plane-circle-check", "fas fa-plane-up", "fas fa-plane", "fas fa-users-gear"])
      setUpdatePayload({ tbType: "fleet", tbName: company!.co_tb_1, value: row })
      const data = `('${row.name}','${row.type}','${row.reg}', ${row.seats})`
      setAddPayload({ tbType: "fleet", tbName: company!.co_tb_1, values: data })
      setDeletePayload({ tbType: "fleet", tbName: company!.co_tb_1, id: row.id })
    }
  }, [row])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRow((row) => ({ ...row, [event.target.name]: event.target.value }))
  }

  const closeDialog = (e: EventDataEdit) => {
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

  const handleUpdate = async (e: EventDataEdit) => {
    e.preventDefault()
    try {
      const response = await updateDataQuery(updatePayload).unwrap()
      setResult(response.data)
    } catch (err) {
      handleError(err)
    }
    closeDialog(e)
  }

  const handleAdd = async (e: EventDataEdit) => {
    e.preventDefault()
    try {
      const response = await insertDataQuery(addPayload).unwrap()
      setResult(response.data)
    } catch (err) {
      handleError(err)
    }
    closeDialog(e)
  }

  const handleDelete = async (e: EventDataEdit) => {
    e.preventDefault()
    const answer = confirm("Delete this data row?")
    try {
      if (answer) {
        const response = await deleteDataQuery(deletePayload).unwrap()
        setResult(response.data)
      }
    } catch (err) {
      handleError(err)
    }
    closeDialog(e)
  }

  const renderedInput = (key: keyof T, index: number) => {
    return (
      <>
        <input
          autoFocus={index === 0}
          type={inputTypes[index]}
          name={key as string}
          value={row[key] as string}
          id={key as string}
          onChange={onChange}
          className="block w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
          placeholder=" "
        />
        <label
          htmlFor={key as string}
          className="absolute top-4 text-md text-slate-400 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90  origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-focus:scale-75 peer-focus:-translate-y-11"
        >
          <i className={`${icons[index]} mr-2`} />
          <span className="capitalize">{key as string}</span>
        </label>
      </>
    )
  }

  return (
    <dialog
      onCancel={(e) => closeDialog(e)}
      ref={ref}
      className="edit rounded-lg p-0 bg-slate-200 dark:bg-slate-700 shadow-md shadow-slate-700 dark:shadow-slate-600 text-slate-800 dark:text-slate-200"
    >
      <div className="flex justify-between rounded-t p-2 items-center text-lg dark:bg-slate-800 bg-slate-300">
        <p className="font-medium pl-4">{row.date ? "FLIGHT" : "FLEET"}</p>
        <button
          onClick={(e) => closeDialog(e)}
          className="py-1 px-3.5 rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 opacity-70 hover:opacity-100 active:scale-90"
        >
          <i className="fas fa-xmark text-2xl" />
        </button>
      </div>

      {/* Airline data (flights, fleet) add, change and delete form --------------------------------------------------*/}

      <form method="dialog" onSubmit={(e) => handleAdd(e)}>
        <div className="grid md:grid-cols-2 gap-8 md:gap-8 w-full p-3 mt-6">
          {(Object.keys(row) as Array<keyof T>).slice(1).map((key, index) => (
            <div key={key as string} className="relative w-full">
              {/* For inputs with keys For and To need to be airports dataset ----------------------------------------------- */}
              {renderedInput(key, index)}
            </div>
          ))}

          <div className={`flex text-sm ${row.id != 0 ? "justify-between" : "justify-end"} text-slate-200`}>
            {row.id !== 0 && (
              <>
                <button
                  onClick={(e) => handleUpdate(e)}
                  type="button"
                  className="py-1 px-2 rounded-full bg-slate-600 opacity-75 hover:opacity-100 active:scale-90"
                >
                  <i className="fas fa-rotate mr-2" />
                  <span>UPDATE</span>
                </button>

                <button
                  disabled={!row.id}
                  type="button"
                  onClick={(e) => handleDelete(e)}
                  className="py-1 px-2 mx-1 rounded-full bg-red-600 opacity-75 hover:opacity-100 active:scale-90"
                >
                  <i className="fas fa-trash-can mr-2" />
                  <span>DELETE</span>
                </button>
              </>
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
