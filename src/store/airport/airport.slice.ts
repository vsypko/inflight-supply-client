import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAirport } from "../../types/airport.types"

interface AirportState {
  selected: IAirport | null
}

const initialState: AirportState = {
  selected: null,
}

export const airportSlice = createSlice({
  name: "airport",
  initialState,
  reducers: {
    selectAirport(state, action: PayloadAction<IAirport | null>) {
      state.selected = action.payload
    },
    // unselectAirport(state) {
    //   state.selected = null
    // },
  },
})

export const airportActions = airportSlice.actions
export const airportReducer = airportSlice.reducer
