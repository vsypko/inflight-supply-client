import { api } from "../api"

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyData: builder.query<any[], { tbType: string; tbName: string; date?: string }>({
      query: (data) => ({
        url: `company/${data.tbType}`,
        params: { tb: data.tbName, date: data?.date },
      }),
      providesTags: ["Data"],
    }),

    insertCompanyData: builder.mutation<
      { data: string; id?: number },
      { tbType: string; tbName: string; values: string }
    >({
      query: (data) => ({
        url: `company/${data.tbType}`,
        method: "POST",
        body: { tb: data.tbName, values: data.values },
      }),
      invalidatesTags: ["Data"],
    }),

    updateCompanyData: builder.mutation<{ data: string }, { tbType: string; tbName: string; value: any }>({
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

    imgUrlUpdate: builder.mutation({
      query: (data) => ({
        url: "company/items/img/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Data"],
    }),

    imgUrlRemove: builder.mutation<{ data: string }, { tbType: string; tbName: string; url: string }>({
      query: (data) => ({
        url: `company/items/img/${data.url}`,
        method: "DELETE",
        body: { tb: data.tbName },
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
