import { Dispatch, SetStateAction } from 'react'

export default function DateInput({
  date,
  setDate,
}: {
  date: Date | null
  setDate: Dispatch<SetStateAction<Date | null>>
}) {
  function handleDecreaseDate() {
    if (date)
      setDate(
        new Date(date?.getFullYear(), date.getMonth(), date.getUTCDate() - 0)
      )
  }

  function handleIncreaseDate() {
    if (date)
      setDate(
        new Date(date.getFullYear(), date.getMonth(), date.getUTCDate() + 2)
      )
  }
  return (
    <div className="flex justify-center items-center z-10">
      <button
        type="button"
        className="h-6 w-6 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
        onClick={handleDecreaseDate}
      >
        <i className="fas fa-chevron-left" />
      </button>
      <label className="">
        <input
          name="date"
          type="date"
          value={date?.toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.valueAsDate)}
          className="bg-transparent"
        />
      </label>
      <button
        type="button"
        className="h-6 w-6 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
        onClick={handleIncreaseDate}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  )
}
