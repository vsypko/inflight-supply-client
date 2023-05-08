import { ICountry, IUserUpdateRequest, IUserUpdateResponse } from "../../types/user.types"
import { api } from "../api"

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `user/auth/${credentials.isLogin ? "signin" : "signup"}`,
        method: "POST",
        body: { email: credentials.email, password: credentials.password },
      }),
    }),

    userUrlUpdate: builder.mutation({
      query: (data) => ({
        url: "user/updateurl",
        method: "POST",
        body: data,
      }),
    }),

    getCountries: builder.query<ICountry[], string>({
      query: () => ({
        url: "search/countries",
      }),
    }),

    userProfileUpdate: builder.mutation<IUserUpdateResponse, IUserUpdateRequest>({
      query: (data) => ({
        url: "user/updateprofile",
        method: "POST",
        body: data,
      }),
    }),

    userUrlRemove: builder.mutation({
      query: (data) => ({
        url: `user/deleteurl/${data}`,
        method: "DELETE",
      }),
    }),

    logout: builder.query({
      query: () => ({
        url: "user/auth/signout",
      }),
    }),
  }),
  overrideExisting: true,
})

export const {
  useLoginMutation,
  useUserUrlUpdateMutation,
  useGetCountriesQuery,
  useUserProfileUpdateMutation,
  useUserUrlRemoveMutation,
  useLazyLogoutQuery,
} = authApi
