import { IAirportResponse } from '../../types/airport.types'
import { Schedule } from '../../types/company.types'
import { api } from '../api'

export const airportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchAirport: builder.query<IAirportResponse, string>({
      query: (search: string) => ({
        url: 'search/airport',
        params: {
          q: search,
        },
      }),
    }),
    searchAirportByCode: builder.query<IAirportResponse, string>({
      query: (search: string) => ({
        url: 'search/airport/code',
        params: {
          q: search,
        },
      }),
    }),
    airportSchedule: builder.query<
      { scheduleFrom: Schedule[]; scheduleTo: Schedule[] },
      { airport: string | null; date: string }
    >({
      query: (data) => ({
        url: 'search/airport/schedule',
        params: {
          airport: data.airport,
          date: data.date,
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useSearchAirportQuery,
  useLazySearchAirportByCodeQuery,
  useLazyAirportScheduleQuery,
} = airportApi
