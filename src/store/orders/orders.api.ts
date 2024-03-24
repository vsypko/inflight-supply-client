import { invalidate } from '@react-three/fiber'
import { api } from '../api'

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFlights: builder.query({
      query: (data) => ({
        url: 'orders/flights',
        params: {
          ap: data.airport,
          co: data.company,
          dtf: data.datefrom,
          dtt: data.dateto,
        },
      }),
      providesTags: ['Flights'],
    }),

    getOrder: builder.query({
      query: (data) => ({
        url: 'orders',
        params: { q: data.id },
      }),
    }),

    setOrder: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: 'orders',
        body: data,
      }),
      invalidatesTags: ['Flights'],
    }),

    deleteOrder: builder.mutation({
      query: (data) => ({
        method: 'DELETE',
        url: 'orders',
        body: data,
      }),
      invalidatesTags: ['Flights'],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetFlightsQuery,
  useGetOrderQuery,
  useLazyGetOrderQuery,
  useSetOrderMutation,
  useDeleteOrderMutation,
} = orderApi
