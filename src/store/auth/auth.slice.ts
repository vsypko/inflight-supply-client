import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../types/user.types"

interface AuthState {
  user: User
}

const initialState: AuthState = {
  user: {
    id: undefined,
    firstname: "",
    lastname: "",
    email: "",
    img_url: "",
    role: "",
    phone: "",
    img_url_data: "",
    country_iso: "",
    country: "",
    phonecode: undefined,
    flag: "",
    company_id: undefined,
    token: "",
  },
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, { payload: user }: PayloadAction<User>): void {
      state.user = user
    },

    updateToken(state, { payload: token }: PayloadAction<string>): void {
      if (state.user) state.user.token = token
    },

    signOut(state): void {
      state.user = initialState.user
    },

    updateUserUrl(state, { payload: { imgUrl } }: PayloadAction<{ imgUrl: string | undefined }>): void {
      state.user.img_url = imgUrl
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const { setUser, updateToken, signOut, updateUserUrl } = authSlice.actions
