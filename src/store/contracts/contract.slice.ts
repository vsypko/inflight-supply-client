import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contract } from '../../types/company.types'

interface ContractState {
  contract: Contract | undefined
}

const initialState: ContractState = {
  contract: undefined,
}

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContract(state, { payload: contract }: PayloadAction<Contract>): void {
      state.contract = contract
    },
  },
})

export const contractActions = contractSlice.actions
export const contractReducer = contractSlice.reducer
export const { setContract } = contractSlice.actions
