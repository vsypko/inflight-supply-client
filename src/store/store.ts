import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { airportReducer } from "./airport/airport.slice"
import { api } from "./api"
import { authReducer } from "./auth/auth.slice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    airport: airportReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
