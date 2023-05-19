import { ReactNode } from "react"

export interface IUser {
  id: number
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
  id: number
  co_name: string
  co_category: string
  co_iata_code: string
  co_cn: string
  co_tb_1: string
  co_tb_2: string
  co_cn_name: string
  co_cn_currency: string
  co_cn_flag: string
}

export interface ICountry {
  iso: string
  title_case: string
  phonecode: number
  currency: string
  flag: string
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
