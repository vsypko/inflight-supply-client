export function shiftSelection(selected: number, index: number) {
  let indeces = []
  const length = Math.abs(index - selected)
  const start = Math.min(index, selected)
  indeces.push(start)
  for (let i = 1; i < length + 1; i++) {
    indeces.push(start + i)
  }
  return indeces
}

export function ctrlSelection(selected: number[], index: number) {
  if (selected.includes(index)) {
    const indeces = selected.filter((item) => item !== index)
    return indeces
  }
  selected.push(index)
  return selected
}

export function selectAll(selection: number | undefined) {
  let indeces: number[] = []
  if (selection) {
    for (let i = 0; i < selection; i++) {
      indeces.push(i)
    }
  }
  return indeces
}
