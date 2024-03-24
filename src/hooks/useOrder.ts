import { useMemo } from 'react'
import { useAppSelector } from './redux'

export const useOrder = () => {
  const { orderItems, selectedFlights } = useAppSelector((state) => state.order)
  return useMemo(
    () => ({ orderItems, selectedFlights }),
    [orderItems, selectedFlights]
  )
}
