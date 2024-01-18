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
  }),
  overrideExisting: true,
})

export const { useGetFlightsQuery } = orderApi
