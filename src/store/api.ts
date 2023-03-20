import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { logOut, setCredentials } from "./auth/auth.slice"
import { RootState } from "./store"

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) headers.set("authorization", `Bearer ${token}`)
    return headers
  },
})

const mutex = new Mutex()
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const updateResult = await baseQuery("user/auth/update", api, extraOptions)
        if (updateResult.data) {
          const user = (api.getState() as RootState).auth.user
          api.dispatch(setCredentials({ user, token: updateResult.data as string }))
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logOut())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: true,
  endpoints: () => ({}),
})
