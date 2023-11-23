import { api } from "../api"

export const contractApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContract: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "contract",
        body: data,
      }),
      invalidatesTags: ["Contract"],
    }),

    getContracts: builder.query({
      query: (data) => ({
        url: "contract",
        params: {
          ap: data.airport,
          ar: data.airline,
        },
      }),
      providesTags: ["Contract"],
    }),
  }),
  overrideExisting: true,
})

export const { useCreateContractMutation, useGetContractsQuery } = contractApi
