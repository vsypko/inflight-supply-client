import { ICountry, IUsersResponse } from "../../types/user.types"
import { api } from "../api"

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IUsersResponse, { column?: string | undefined; value?: number | undefined }>({
      query: (data) => ({
        url: "search/users",
        method: "GET",
        params: data,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetUsersQuery } = usersApi
