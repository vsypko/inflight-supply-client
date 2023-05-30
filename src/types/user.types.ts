import { ReactNode } from "react"
import { ICompany } from "./company.types"

export interface IUser {
  id: number
  firstname: string | undefined
  lastname: string | undefined
  email: string
  img_url: string | undefined
  role: string
  company: number | undefined
  phone: string | undefined
  country: string | undefined
  img_url_data: string | undefined
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
  country: string
}

export interface IUserUpdateResponse {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  country_iso: string
  country: ICountry
}

export type Props = {
  children: ReactNode
}
