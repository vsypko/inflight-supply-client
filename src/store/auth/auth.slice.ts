import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ICountry, IUserState } from "../../types/user.types"

const initialState: IUserState = {
  user: null,
  company: null,
  country: null,
  token: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload: { user, company, country, token } }: PayloadAction<IUserState>): void {
      state.user = user
      state.company = company
      state.country = country
      state.token = token
    },

    signOut(state): void {
      state.user = null
      state.company = null
      state.country = null
      state.token = null
    },

    updateUserUrl(state, { payload: { url } }: PayloadAction<{ url: string | undefined }>): void {
      if (state.user) {
        state.user.usr_url = url
        // state.user.usr_url_data = url_data
      }
    },

    updateCountry(state, { payload: country }: PayloadAction<ICountry>): void {
      if (state.country) {
        state.country.cn_iso = country.cn_iso
        state.country.cn_case_name = country.cn_case_name
        state.country.cn_phonecode = country.cn_phonecode
        state.country.cn_flag = country.cn_flag
      }
    },

    updateUserData(
      state,
      {
        payload: { firstname, lastname, phone, cn, country },
      }: PayloadAction<{
        firstname: string | undefined
        lastname: string | undefined
        phone: string | undefined
        cn: string | undefined
        country: ICountry | null
      }>,
    ): void {
      if (state.user && state.country) {
        state.user.usr_firstname = firstname
        state.user.usr_lastname = lastname
        state.user.usr_cn = cn
        state.user.usr_phone = phone
        state.country = country
      }
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const { setCredentials, signOut, updateUserData, updateUserUrl, updateCountry } = authSlice.actions
