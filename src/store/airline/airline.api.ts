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
      providesTags: ["Flight"],
    }),

    loadFlights: builder.mutation<{ data: string }, { id: number; values: string }>({
      query: (data) => ({
        url: "company/flights/",
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["Flight"],
    }),

    // addFlight: builder.mutation<{ data: string }, { id: number; values: string }>({
    //   query: (data) => ({
    //     url: "company/flight/",
    //     method: "POST",
    //     body: { data },
    //   }),
    // }),
    // updateFlight: builder.mutation<{ data: string }, { id: number; values: string }>({
    //   query: (data) => ({
    //     url: "company/flights/",
    //     method: "POST",
    //     body: { data },
    //   }),
    // }),

    deleteFlight: builder.mutation<{ data: string }, { company_id: number; flight_id: number }>({
      query: ({ company_id, flight_id }) => ({
        url: `company/flight/`,
        method: "DELETE",
        params: { co: company_id, fl: flight_id },
      }),
      invalidatesTags: ["Flight"],
    }),
  }),
  overrideExisting: true,
})

export const { useLazyGetFlightsQuery, useGetFlightsQuery, useLoadFlightsMutation, useDeleteFlightMutation } =
  airlineApi
