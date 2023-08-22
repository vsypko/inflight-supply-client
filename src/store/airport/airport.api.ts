import { IAirportResponse } from "../../types/airport.types"
import { ISchedule } from "../../types/company.types"
import { api } from "../api"

export const airportApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchAirport: build.query<IAirportResponse, string>({
      query: (search: string) => ({
        url: "search/airport",
        params: {
          q: search,
        },
      }),
    }),
    searchAirportbyCode: build.query<IAirportResponse, string>({
      query: (search: string) => ({
        url: "search/airport/code",
        params: {
          q: search,
        },
      }),
    }),
    airportSchedule: build.query<
      { scheduleFrom: ISchedule[]; scheduleTo: ISchedule[] },
      { airport: string | null; date: string }
    >({
      query: (data) => ({
        url: "search/airport/schedule",
        params: {
          airport: data.airport,
          date: data.date,
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useSearchAirportQuery, useLazySearchAirportbyCodeQuery, useLazyAirportScheduleQuery } = airportApi
