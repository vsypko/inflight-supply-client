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

    photoUpdate: builder.mutation({
      query: (data) => ({
        url: "user/photoupdate",
        method: "POST",
        body: data,
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

export const { useLoginMutation, usePhotoUpdateMutation, useLazyLogoutQuery } = authApi
