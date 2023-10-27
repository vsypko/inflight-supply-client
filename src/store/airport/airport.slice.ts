import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Airport } from "../../types/airport.types"

interface AirportState {
  airport: Airport
}

export const initialState: AirportState = {
  airport: {
    id: undefined,
    type_ap: "",
    name: "",
    latitude: undefined,
    longitude: undefined,
    elevation_ft: undefined,
    continent: "",
    country: "",
    country_iso: "",
    iso_region: "",
    municipality: "",
    scheduled: "",
    icao: "",
    iata: "",
    home_link: "",
  },
}

export const airportSlice = createSlice({
  name: "airport",
  initialState,
  reducers: {
    selectAirport(state, { payload: airport }: PayloadAction<Airport>): void {
      state.airport = airport
    },
  },
})

export const airportActions = airportSlice.actions
export const airportReducer = airportSlice.reducer
