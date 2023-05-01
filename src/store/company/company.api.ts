import { api } from "../api"
import { IFleet, IFlight } from "../../types/airline.types"

export const airlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyData: builder.query<[], { tbType: string; tbName: string; date?: string }>({
      query: (data) => ({
        url: `company/${data.tbType}`,
        params: { tb: data.tbName, date: data?.date },
      }),
      providesTags: ["Data"],
    }),

    insertCompanyData: builder.mutation<{ data: string }, { tbType: string; tbName: string; values: string }>({
      query: (data) => ({
        url: `company/${data.tbType}`,
        method: "POST",
        body: { tb: data.tbName, values: data.values },
      }),
      invalidatesTags: ["Data"],
    }),

    updateCompanyData: builder.mutation<
      { data: string },
      { tbType: string; tbName: string; value: IFleet | IFlight | object }
    >({
      query: (data) => ({
        url: `company/${data.tbType}`,
        method: "PATCH",
        body: { tb: data.tbName, value: data.value },
      }),
      invalidatesTags: ["Data"],
    }),

    deleteCompanyData: builder.mutation<{ data: string }, { tbType: string; tbName: string; id: number }>({
      query: (data) => ({
        url: `company/${data.tbType}`,
        method: "DELETE",
        params: { tb: data.tbName, id: data.id },
      }),
      invalidatesTags: ["Data"],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetCompanyDataQuery,
  useLazyGetCompanyDataQuery,
  useInsertCompanyDataMutation,
  useUpdateCompanyDataMutation,
  useDeleteCompanyDataMutation,
} = airlineApi
