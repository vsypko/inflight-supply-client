import { api } from "../api"

export const contractApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContract: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "contract",
        body: data,
      }),
    }),

    searchContracts: builder.query({
      query: (search) => ({
        url: "contract",
        params: {
          q: search,
        },
      }),
    }),
  }),
  overrideExisting: true,
})

export const { useCreateContractMutation, useSearchContractsQuery } = contractApi
