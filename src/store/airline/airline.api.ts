import { api } from "../api"
import { IFlight } from "../../types/airline.types"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { SerializedError } from "@reduxjs/toolkit"

export const airlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFlights: builder.query<IFlight[], { id: number; date: string }>({
      query: ({ id, date }) => ({
        url: `company/flights/`,
        method: "GET",
        params: { id, date },
      }),
    }),

    loadFlights: builder.mutation<{ data: string }, { id: number; values: string }>({
      query: (data) => ({
        url: "company/flights/",
        method: "POST",
        body: { data },
      }),
    }),
  }),
  overrideExisting: true,
})

export const { useLazyGetFlightsQuery, useGetFlightsQuery, useLoadFlightsMutation } = airlineApi
