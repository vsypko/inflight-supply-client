import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Contract,
  Flight,
  FlightSelected,
  IOrder,
  IOrderItem,
} from '../../types/company.types'

interface OrderState {
  // contract: Contract | undefined
  order: IOrder
  selectedFlights: FlightSelected[]
}

const initialState: OrderState = {
  // contract: undefined,
  order: {
    id: undefined,
  },
  selectedFlights: [],
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder(state, { payload: order }: PayloadAction<IOrder>): void {
      state.order = order
    },
    setSelectedFlights(
      state,
      { payload: flights }: PayloadAction<FlightSelected[]>
    ): void {
      state.selectedFlights = flights
    },
  },
})

export const orderActions = orderSlice.actions
export const orderReducer = orderSlice.reducer
export const { setOrder, setSelectedFlights } = orderSlice.actions
