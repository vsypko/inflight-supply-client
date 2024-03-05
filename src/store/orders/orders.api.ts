import { Flight } from '../../types/company.types'
import { api } from '../api'

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFlights: builder.query({
      query: (data) => ({
        url: 'orders',
        params: {
          ap: data.airport,
          co: data.company,
          dtf: data.datefrom,
          dtt: data.dateto,
        },
      }),
      providesTags: ['Contract'],
    }),
    setOrder: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: 'orders',
        body: data,
      }),
      invalidatesTags: ['Contract'],
    }),
  }),
  overrideExisting: true,
})

export const { useGetFlightsQuery, useSetOrderMutation } = orderApi
