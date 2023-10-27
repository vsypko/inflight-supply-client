import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { airportReducer } from "./airport/airport.slice"
import { api } from "./api"
import { authReducer } from "./auth/auth.slice"
import { companyReducer } from "./company/company.slice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    airport: airportReducer,
    auth: authReducer,
    company: companyReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
