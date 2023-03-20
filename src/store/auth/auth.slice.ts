import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAuthState } from "../../types/user.types"

const initialState: IAuthState = {
  user: null,
  token: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload: { user, token } }: PayloadAction<IAuthState>): void {
      state.user = user
      state.token = token
    },
    logOut(state): void {
      state.user = null
      state.token = null
    },
    update(
      state,
      {
        payload: { firstname, lastname, photourl },
      }: PayloadAction<{ firstname: string | undefined; lastname: string | undefined; photourl: string | undefined }>,
    ): void {
      if (state.user) {
        state.user.usr_firstname = firstname
        state.user.usr_lastname = lastname
        state.user.usr_photourl = photourl
      }
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const { setCredentials, update, logOut } = authSlice.actions
