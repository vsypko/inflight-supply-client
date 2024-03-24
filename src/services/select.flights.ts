import { PointerEvent } from 'react'
import { FlightSelected } from '../types/company.types'

export function selector(
  filtered: FlightSelected[],
  selected: FlightSelected[],
  flight?: FlightSelected,
  e?: PointerEvent<HTMLElement>
) {
  let filteredSelected = filtered.filter((fltr) =>
    selected.some((slct) => slct.id === fltr.id)
  )

  if (flight && e) {
    if (e.ctrlKey) {
      if (filteredSelected.some((fltrslct) => fltrslct.id === flight.id)) {
        selected = selected.filter((slct) => slct.id !== flight.id)
      } else {
        selected.push(flight)
      }
      return selected
    }

    if (e.shiftKey) {
      if (filteredSelected.length === 1) {
        const firstSelection = filtered.indexOf(filteredSelected[0])
        const lastSelection = filtered.indexOf(flight)
        filtered = filtered.filter(
          (_, i) =>
            (i > firstSelection && i <= lastSelection) ||
            (i < firstSelection && i >= lastSelection)
        )
        selected.push(...filtered)
        return selected
      }
    }
    selected = selected.filter(
      (slct) => !filtered.some((fltr) => fltr.id === slct.id)
    )
    selected.push(flight)

    return selected
  }

  if (filteredSelected.length === filtered.length) {
    selected = selected.filter(
      (slct) => !filteredSelected.some((fltrslct) => fltrslct.id === slct.id)
    )
    return selected
  }

  filtered = filtered.filter(
    (fltr) => !selected.some((slct) => slct.id === fltr.id)
  )
  selected.push(...filtered)

  return selected
}
