import { ICountry, IUsersResponse } from "../../types/user.types"
import { api } from "../api"

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IUsersResponse, string>({
      query: () => ({
        url: "search/users",
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetUsersQuery } = usersApi
