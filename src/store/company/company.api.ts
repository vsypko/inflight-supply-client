import { ICompanyResponse } from '../../types/company.types'
import { api } from '../api'

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: 'company',
        body: data,
      }),
    }),

    searchCompany: builder.query<ICompanyResponse, string>({
      query: (search) => ({
        url: 'company',
        params: {
          q: search,
        },
      }),
    }),

    getCompaniesForAirport: builder.query({
      query: (data) => ({
        url: 'company/airport',
        params: {
          type: data.type,
          airport: data.airport,
        },
      }),
    }),

    getCompanyData: builder.query<
      any[],
      { type: string; id?: number; date?: string }
    >({
      query: (data) => ({
        url: `company/${data.type}`,
        params: {
          id: data.id,
          date: data.date,
        },
      }),
      providesTags: ['Company'],
    }),

    insertCompanyData: builder.mutation<
      { data: string; id: number },
      { type: string; values: any }
    >({
      query: (data) => ({
        url: `company/${data.type}`,
        method: 'POST',
        body: {
          values: data.values,
        },
      }),
      invalidatesTags: ['Company'],
    }),

    updateCompanyData: builder.mutation<
      { data: string },
      { type: string; id: number; value: any }
    >({
      query: (data) => ({
        url: `company/${data.type}`,
        method: 'PATCH',
        body: {
          id: data.id,
          value: data.value,
        },
      }),
      invalidatesTags: ['Company'],
    }),

    deleteCompanyData: builder.mutation<
      { data: string },
      { type: string; id: number; co_id?: number }
    >({
      query: (data) => ({
        url: `company/${data.type}`,
        method: 'DELETE',
        params: {
          id: data.id,
          co_id: data.co_id,
        },
      }),
      invalidatesTags: ['Company'],
    }),

    imgUrlUpdate: builder.mutation({
      query: (data) => ({
        url: 'company/items/img/update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),

    imgUrlRemove: builder.mutation<
      { data: string },
      { type: string; id: number }
    >({
      query: (data) => ({
        url: `company/items/img/${data.type}`,
        method: 'DELETE',
        params: {
          id: data.id,
        },
      }),
      invalidatesTags: ['Company'],
    }),
  }),
  overrideExisting: true,
})

export const {
  useCreateCompanyMutation,
  useSearchCompanyQuery,
  useGetCompaniesForAirportQuery,
  useGetCompanyDataQuery,
  useLazyGetCompanyDataQuery,
  useInsertCompanyDataMutation,
  useUpdateCompanyDataMutation,
  useDeleteCompanyDataMutation,
  useImgUrlUpdateMutation,
  useImgUrlRemoveMutation,
} = companyApi
