import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FlightSelected, IOrderItem } from '../../types/company.types'
import OrderedItem from '../../components/OrderedItem'

interface OrderState {
  orderItems: IOrderItem[]
  selectedFlights: FlightSelected[]
}

const initialState: OrderState = {
  orderItems: [],
  selectedFlights: [],
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderItems(
      state,
      { payload: orderItems }: PayloadAction<IOrderItem[]>
    ): void {
      state.orderItems = orderItems
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
export const { setOrderItems, setSelectedFlights } = orderSlice.actions
