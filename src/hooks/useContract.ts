import { useMemo } from 'react'
import { useAppSelector } from './redux'

export const useContract = () => {
  const { contract } = useAppSelector((state) => state.contract)
  return useMemo(() => ({ contract }), [contract])
}
