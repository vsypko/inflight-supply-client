import { Dispatch, SetStateAction } from "react"
import { IFleet, IFlight } from "../types/company.types"
import { Item } from "../types/company.types"

export default function SeveRemove({
  setNew,
  handleSave,
}: {
  setNew: Dispatch<SetStateAction<IFlight[]>> | Dispatch<SetStateAction<IFleet[]>> | Dispatch<SetStateAction<Item[]>>
  handleSave: () => Promise<void>
}) {
  return (
    <div className="flex w-full justify-end mb-1">
      <button
        onClick={() => setNew([])}
        type="button"
        className="mr-6 px-2 py-1 rounded-full active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
      >
        <i className="fas fa-trash-can mr-2" />
        <span>Remove</span>
      </button>
      <button
        onClick={handleSave}
        type="button"
        className="px-2 py-1 rounded-full active:scale-90 bg-teal-500 dark:bg-teal-800 opacity-75 hover:opacity-100"
      >
        <i className="fas fa-download mr-2" />
        <span>Save</span>
      </button>
    </div>
  )
}
