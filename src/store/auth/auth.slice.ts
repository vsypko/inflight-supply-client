import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ICountry, IUser, IUserState } from "../../types/user.types"

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

    updateUserUrl(state, { payload: { imgUrl } }: PayloadAction<{ imgUrl: string | undefined }>): void {
      if (state.user) {
        state.user.img_url = imgUrl
      }
    },

    updateCountry(state, { payload: country }: PayloadAction<ICountry>): void {
      if (state.country) {
        state.country.iso = country.iso
        state.country.title_case = country.title_case
        state.country.phonecode = country.phonecode
        state.country.currency = country.currency
        state.country.flag = country.flag
      }
    },

    updateUserData(
      state,
      {
        payload: { user, country },
      }: PayloadAction<{
        user: IUser
        country: ICountry
      }>,
    ): void {
      if (state.user && state.country) {
        state.user = user
        state.country = country
      }
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const { setCredentials, signOut, updateUserData, updateUserUrl, updateCountry } = authSlice.actions
