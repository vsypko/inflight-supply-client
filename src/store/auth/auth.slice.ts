import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUserState } from "../../types/user.types"

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

    logOut(state): void {
      state.user = null
      state.company = null
      state.country = null
      state.token = null
    },

    updateUserData(
      state,
      {
        payload: { firstname, lastname, phone },
      }: PayloadAction<{ firstname: string | undefined; lastname: string | undefined; phone: string | undefined }>,
    ): void {
      if (state.user) {
        state.user.usr_firstname = firstname
        state.user.usr_lastname = lastname
        state.user.usr_phone = phone
      }
    },

    updateUserUrl(state, { payload: url }) {
      if (state.user) {
        state.user.usr_url = url
      }
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const { setCredentials, logOut, updateUserData, updateUserUrl } = authSlice.actions
