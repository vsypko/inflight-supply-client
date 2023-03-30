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
  usr_cn: string | undefined
  usr_url_data: string | undefined
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

export interface IUsersResponse {
  total_count: number
  users: IUser[]
}

export interface IUserUpdateRequest {
  id: number
  firstname: string
  lastname: string
  phone: string
  cn: string
}

export interface IUserUpdateResponse {
  firstname: string
  lastname: string
  phone: string
  cn: string
  country: ICountry
}

export type Props = {
  children: ReactNode
}
