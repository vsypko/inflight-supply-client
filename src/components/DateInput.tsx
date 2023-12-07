import { Dispatch, SetStateAction } from "react"

export default function DateInput({ date, setDate }: { date: string; setDate: Dispatch<SetStateAction<string>> }) {
  function handleDecreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() - 0)
        .toISOString()
        .slice(0, 10),
    )
  }

  function handleIncreaseDate() {
    setDate(
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getUTCDate() + 2)
        .toISOString()
        .slice(0, 10),
    )
  }
  return (
    <div className="flex text-xl justify-center z-10">
      <button
        type="button"
        className="h-8 w-8 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
        onClick={handleDecreaseDate}
      >
        <i className="fas fa-chevron-left" />
      </button>
      <label className="mx-2">
        <input
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent"
        />
      </label>
      <button
        type="button"
        className="h-8 w-8 rounded-full opacity-75 hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-90"
        onClick={handleIncreaseDate}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  )
}
