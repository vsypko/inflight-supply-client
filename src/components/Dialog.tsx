import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef } from "react"

import {
  useDeleteCompanyDataMutation,
  useInsertCompanyDataMutation,
  useUpdateCompanyDataMutation,
} from "../store/company/company.api"
import { FLIGHT_EDITOR_ICONS, FLIGHT_INPUT_TYPES, FLEET_EDITOR_ICONS, FLEET_INPUT_TYPES } from "../const/editorsConst"
import { Fleet, Flight } from "../types/company.types"

interface Props<T> {
  headers: string[]
  row: T
  setRow: Dispatch<SetStateAction<T>>
  setDialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>
  setErrorMsg: Dispatch<SetStateAction<string>>
  setResult: Dispatch<SetStateAction<string>>
  type: "fleet" | "flights"
}

export default function Dialog<T extends Fleet | Flight>(props: Props<T>): JSX.Element {
  const { headers, row, setRow, setDialogRef, setErrorMsg, setResult, type } = props
  const [deleteDataQuery] = useDeleteCompanyDataMutation()
  const [insertDataQuery] = useInsertCompanyDataMutation()
  const [updateDataQuery] = useUpdateCompanyDataMutation()

  const ref = useRef<HTMLDialogElement | null>(null)

  const handleError = (err: any): void => {
    setErrorMsg("")
    if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
    if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
  }

  useEffect(() => {
    setDialogRef(ref.current)
  }, [ref])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRow((row) => ({ ...row, [event.target.name]: event.target.value }))
  }

  const closeDialog = () => {
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

  const handleUpdate = async () => {
    try {
      const response = await updateDataQuery({ type, id: row.id, value: row }).unwrap()
      setResult(response.data)
    } catch (error) {
      handleError(error)
    }
    closeDialog()
  }

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const response = await insertDataQuery({ type, values: [row] }).unwrap()
      setResult(response.data)
    } catch (error) {
      handleError(error)
    }
    closeDialog()
  }

  const handleDelete = async () => {
    const answer = confirm("Delete this data row?")
    try {
      if (answer) {
        const response = await deleteDataQuery({ type, id: row.id }).unwrap()
        setResult(response.data)
      }
    } catch (error) {
      handleError(error)
    }
    closeDialog()
  }

  return (
    <dialog
      onCancel={closeDialog}
      ref={ref}
      className="edit rounded-lg p-0 bg-slate-200 dark:bg-slate-700 shadow-md shadow-slate-700 dark:shadow-slate-600 text-slate-800 dark:text-slate-200"
    >
      <div className="flex justify-between rounded-t p-2 items-center text-lg dark:bg-slate-800 bg-slate-300">
        <p className="font-medium pl-4">{type === "fleet" ? "FLEET" : "FLIGHT"}</p>
        <button
          onClick={closeDialog}
          className="py-1 px-3.5 rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 opacity-70 hover:opacity-100 active:scale-90"
        >
          <i className="fas fa-xmark text-2xl" />
        </button>
      </div>

      {/* Company flights or fleet add, change and delete form --------------------------------------------------*/}

      <form method="dialog" onSubmit={handleAdd}>
        <div className="grid md:grid-cols-2 gap-8 md:gap-8 w-full p-3 mt-6">
          {headers.map((header, index) => (
            <div key={header} className="relative w-full">
              {/* For inputs with names From and To need to be airports dataset ----------------------------------------------- */}

              <input
                autoFocus={index === 0}
                type={type === "fleet" ? FLEET_INPUT_TYPES[index] : FLIGHT_INPUT_TYPES[index]}
                name={header}
                value={row[header as keyof T] as string}
                id={header}
                onChange={onChange}
                className="block w-full outline-none text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:ring-0 peer"
                placeholder=" "
              />
              <label
                htmlFor={header}
                className="absolute top-4 text-md text-slate-400 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90  origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-focus:scale-75 peer-focus:-translate-y-11"
              >
                <i className={`${type === "fleet" ? FLEET_EDITOR_ICONS[index] : FLIGHT_EDITOR_ICONS[index]} mr-2`} />
                <span className={`${header.length < 4 ? "uppercase" : "capitalize"}`}>{header}</span>
              </label>
            </div>
          ))}

          {/* Form сontrol buttons --------------------------------------------------------------------------------------------- */}

          <div
            className={`flex col-start-2 text-sm ${row.id !== 0 ? "justify-between" : "justify-end"} text-slate-200`}
          >
            {row.id !== 0 && (
              <>
                <button
                  onClick={handleUpdate}
                  type="button"
                  className="py-1 px-2 rounded-full bg-slate-600 opacity-75 hover:opacity-100 active:scale-90"
                >
                  <i className="fas fa-rotate mr-2" />
                  <span>UPDATE</span>
                </button>

                <button
                  disabled={!row.id}
                  type="button"
                  onClick={handleDelete}
                  className="py-1 px-2 mx-1 rounded-full bg-red-700 opacity-75 hover:opacity-100 active:scale-90"
                >
                  <i className="fas fa-trash-can mr-2" />
                  <span>DELETE</span>
                </button>
              </>
            )}
            <button
              type="submit"
              className="py-1 px-2 rounded-full bg-teal-800 opacity-70 hover:opacity-100 active:scale-90"
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
