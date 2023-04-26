import { api } from "../api"
import { IFleet, IFlight } from "../../types/airline.types"

export const airlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFleet: builder.query<IFleet[], { id: number }>({
      query: ({ id }) => ({
        url: "company/fleet/",
        method: "GET",
        params: { id },
      }),
      providesTags: ["Fleet"],
    }),

    getFlights: builder.query<IFlight[], { id: number; date: string }>({
      query: ({ id, date }) => ({
        url: `company/flights/`,
        method: "GET",
        params: { id, date },
      }),
      providesTags: ["Flight"],
    }),

    loadFlights: builder.mutation<{ data: string }, { id: number; values: string }>({
      query: ({ id, values }) => ({
        url: "company/flights/",
        method: "POST",
        body: { id, values },
      }),
      invalidatesTags: ["Flight"],
    }),

    updateFlight: builder.mutation<{ data: string }, { id: number; flight: IFlight }>({
      query: ({ id, flight }) => ({
        url: `company/flight/${flight.id}`,
        method: "PATCH",
        body: { co: id, flight },
      }),
      invalidatesTags: ["Flight"],
    }),

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

export const {
  useGetFleetQuery,
  useLazyGetFlightsQuery,
  useGetFlightsQuery,
  useLoadFlightsMutation,
  useUpdateFlightMutation,
  useDeleteFlightMutation,
} = airlineApi
