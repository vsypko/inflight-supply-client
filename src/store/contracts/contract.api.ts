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
          co: data.company,
          cat: data.category,
        },
      }),
      providesTags: ["Contract"],
    }),

    signContract: builder.mutation({
      query: (data) => ({
        method: "PATCH",
        url: "contract",
        body: data,
      }),
      invalidatesTags: ["Contract"],
    }),

    rejectContract: builder.mutation({
      query: (data) => ({
        method: "DELETE",
        url: "contract",
        params: {
          q: data.id,
        },
      }),
      invalidatesTags: ["Contract"],
    }),
  }),
  overrideExisting: true,
})

export const { useCreateContractMutation, useGetContractsQuery, useSignContractMutation, useRejectContractMutation } =
  contractApi
