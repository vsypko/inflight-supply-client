import { api } from "../api"

export const airlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addSchedule: builder.mutation({
      query: (data) => ({
        url: "company/schedule/",
        method: "POST",
        body: { data },
      }),
    }),
  }),
  overrideExisting: true,
})

export const { useAddScheduleMutation } = airlineApi
