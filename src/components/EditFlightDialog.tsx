import { ChangeEvent, Dispatch, ReactNode, SetStateAction, forwardRef, useEffect, useRef, useState } from "react"
import { IFlight } from "../types/airline.types"

interface Props {
  children?: ReactNode
  row: IFlight
  setRow: Dispatch<SetStateAction<IFlight>>
}

const EditFlightDialog = forwardRef<HTMLDialogElement, Props>(function EditFlightDialog(props, ref) {
  const { row, setRow } = props
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
  useEffect(() => {
    if (row && row.date === "") {
      const formatedDate = new Date().toISOString().slice(0, 10)
      setRow((row) => ({ ...row, date: formatedDate }))
    }
  }, [row])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRow((row) => ({ ...row, [event.target.name]: event.target.value }))
  }
  const handleClick = () => {
    console.log("clicked")
  }
  return (
    <dialog
      ref={ref}
      className="p-2 mt-40 md:ml-32 md:w-1/3 rounded-lg bg-slate-200 dark:bg-slate-700 shadow-md shadow-slate-700 dark:shadow-slate-600 text-slate-800 dark:text-slate-200  backdrop:bg-slate-900 backdrop:opacity-60"
    >
      <p className="text-center font-medium mb-4">FLIGHT</p>
      <form method="dialog">
        <div className="grid md:grid-cols-2 gap-8 md:gap-8 w-full group">
          {(Object.keys(row) as Array<keyof IFlight>).slice(1).map((key, index) => (
            <div key={key} className="relative w-full">
              <input
                autoFocus
                type={types[index]}
                name={key}
                value={row[key]}
                id={key}
                onChange={onChange}
                className="block w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
              />
              <label
                htmlFor={key}
                className="absolute text-md text-slate-400 dark:text-slate-400 duration-300 transform -translate-y-11 scale-90  origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-focus:scale-75 peer-focus:-translate-y-12"
              >
                <i className={`fas ${icons[index]} mr-2`} />
                <span className="capitalize">{key}</span>
              </label>
            </div>
          ))}
          <div className="flex text-sm justify-between text-slate-200">
            <button
              type="button"
              onClick={handleClick}
              className="py-1 px-2 rounded-full bg-slate-600 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plane-circle-exclamation mr-2" />
              <span>CANCEL</span>
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="py-1 px-2 rounded-full bg-red-600 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plane-circle-xmark mr-2" />
              <span>DELETE</span>
            </button>
            <button
              type="submit"
              className="py-1 px-2 rounded-full bg-teal-600 opacity-70 hover:opacity-100 active:scale-90"
            >
              <i className="fas fa-plane-circle-check mr-2" />
              <span>SAVE</span>
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
})
export default EditFlightDialog
