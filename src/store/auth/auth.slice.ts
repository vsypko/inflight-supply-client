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
      // state.user.firstname = data.firstname ? data.firstname : state.user.firstname
      // state.user.lastname = data.lastname ? data.lastname : state.user.lastname
    },

    updateToken(state, { payload: token }: PayloadAction<string>): void {
      if (state.user) state.user.token = token
    },

    signOut(state): void {
      state = initialState
    },

    updateUserUrl(state, { payload: { imgUrl } }: PayloadAction<{ imgUrl: string | undefined }>): void {
      state.user.img_url = imgUrl
    },

    // updateUserCountry(state, { payload: country }: PayloadAction<ICountry>): void {
    //   if (state.user) {
    //   }
    // },

    // updateUserCompany(state, { payload: company }: PayloadAction<ICompany>): void {
    //   if (state.user) {
    //     state.company = company
    //   }
    // },

    // setUserRole(state, { payload: role }: PayloadAction<string>): void {
    //   if (state.user) {
    //     state.user.role = role
    //   }
    // },

    //     updateUserData(
    //       state,
    //       {
    //         payload: { user, country },
    //       }: PayloadAction<{
    //         user: IUser
    //         country: ICountry
    //       }>,
    //     ): void {
    //       if (state.user && state.country) {
    //         state.user = user
    //         state.country = country
    //       }
    //     },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
export const {
  setUser,
  updateToken,
  signOut,
  updateUserUrl,
  // updateUserCountry,
  // updateUserCompany,
  // setUserRole,
} = authSlice.actions
