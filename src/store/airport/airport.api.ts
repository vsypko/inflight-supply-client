import { IAirportResponse } from "../../types/airport.types"
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
  }),
  overrideExisting: false,
})

export const { useSearchAirportQuery, useLazySearchAirportbyCodeQuery } = airportApi
