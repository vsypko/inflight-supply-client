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

    urlUpdate: builder.mutation({
      query: (data) => ({
        url: "user/urlupdate",
        method: "POST",
        body: data,
      }),
    }),

    urlDelete: builder.mutation({
      query: (data: string | undefined) => ({
        url: `user/urldelete/${data}`,
        method: "DELETE",
      }),
    }),

    logout: builder.query({
      query: () => ({
        url: "user/auth/signout",
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useLoginMutation, useUrlUpdateMutation, useUrlDeleteMutation, useLazyLogoutQuery } = authApi
