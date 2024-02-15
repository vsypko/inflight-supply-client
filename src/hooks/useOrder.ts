import { useMemo } from 'react'
import { useAppSelector } from './redux'

export const useOrder = () => {
  const { order, selectedFlights } = useAppSelector((state) => state.order)
  return useMemo(() => ({ order, selectedFlights }), [order, selectedFlights])
}
