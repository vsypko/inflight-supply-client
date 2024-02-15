import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Flight,
  FlightSelected,
  IOrder,
  IOrderItem,
} from '../../types/company.types'

interface OrderState {
  order: IOrder
  selectedFlights: FlightSelected[]
}

const initialState: OrderState = {
  order: {
    id: undefined,
    flight: undefined,
    created: undefined,
    contract: undefined,
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
