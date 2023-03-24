import { ReactNode } from "react"

export interface IUser {
  usr_id: number
  usr_firstname: string | undefined
  usr_lastname: string | undefined
  usr_email: string
  usr_url: string | undefined
  usr_role_name: string
  usr_co: number | undefined
  usr_phone: string | undefined
  usr_cn: number | undefined
}

export interface ICompany {
  co_name: string
  co_country_iso: string
  co_country_name: string
  co_country_flag: string
}

export interface ICountry {
  cn_iso: string
  cn_case_name: string
  cn_phonecode: number
  cn_flag: string
}

export interface IUserState {
  user: IUser | null
  company: ICompany | null
  country: ICountry | null
  token: string | null
}

export interface ITokens {
  accessToken: string
  refreshToken: string
}

// export interface IAuthState {
//   user_data: IUserResponse | null
//   token: string | null
// }

// export interface IUser {
//   usr_id: number
//   usr_firstname: string | undefined
//   usr_lastname: string | undefined
//   usr_email: string
//   role_name: string
//   usr_photourl: string | undefined
//   usr_phone: string | undefined
//   usr_cn_phonecode: number | undefined
//   usr_cn_flag: string | undefined
//   co_name: string | undefined
//   co_cn_name: string | undefined
//   co_cn_flag: string | undefined
// }

export interface IUsersResponse {
  total_count: number
  users: IUser[]
}
// export interface IUserUpdate {
//   name: string
//   surname: string
//   photoUrl: string
// }

// export interface IAuthState {
//   user: IUser | null
//   token: string | null
// }

export type Props = {
  children: ReactNode
}
