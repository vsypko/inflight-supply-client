import { api } from "../api"

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyData: builder.query<any[], { type: string; id: number; date?: string }>({
      query: (data) => ({
        url: `company/${data.type}`,
        params: {
          id: data.id,
          date: data?.date,
        },
      }),
      providesTags: ["Data"],
    }),

    insertCompanyData: builder.mutation<{ data: string; id: number }, { type: string; values: string }>({
      query: (data) => ({
        url: `company/${data.type}`,
        method: "POST",
        body: {
          values: data.values,
        },
      }),
      invalidatesTags: ["Data"],
    }),

    updateCompanyData: builder.mutation<{ data: string }, { type: string; id: number; value: any }>({
      query: (data) => ({
        url: `company/${data.type}`,
        method: "PATCH",
        body: {
          id: data.id,
          value: data.value,
        },
      }),
      invalidatesTags: ["Data"],
    }),

    deleteCompanyData: builder.mutation<{ data: string }, { type: string; id: number }>({
      query: (data) => ({
        url: `company/${data.type}`,
        method: "DELETE",
        params: {
          id: data.id,
        },
      }),
      invalidatesTags: ["Data"],
    }),

    imgUrlUpdate: builder.mutation({
      query: (data) => ({
        url: "company/items/img/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Data"],
    }),

    imgUrlRemove: builder.mutation<{ data: string }, { type: string; id: number }>({
      query: (data) => ({
        url: `company/items/img/${data.type}`,
        method: "DELETE",
        params: {
          id: data.id,
        },
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
  useImgUrlUpdateMutation,
  useImgUrlRemoveMutation,
} = companyApi
