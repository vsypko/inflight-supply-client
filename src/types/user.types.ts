import { ReactNode } from 'react'
import { Company } from './company.types'

export interface User {
  id: number | undefined
  firstname: string | undefined
  lastname: string | undefined
  email: string | undefined
  img_url: string | undefined
  role: string | undefined
  phone: string | undefined
  img_url_data: string | undefined
  country_iso: string | undefined
  country: string | undefined
  phonecode: number | undefined
  flag: string | undefined
  currency: string | undefined
  company_id: number | undefined
  token: string | undefined
}

export interface UserProfile {
  id: number | undefined
  firstname: string | undefined
  lastname: string | undefined
  phone: string | undefined
}

export interface Country {
  iso: string
  title_case: string
  phonecode: number
  flag: string
  currency: string
}

export interface IUserState {
  user: User | null
  company: Company | null
  country: Country | null
  token: string | null
}

export interface ITokens {
  accessToken: string
  refreshToken: string
}

export interface IUsersResponse {
  total_count: number
  users: User[]
}

export interface IUserProfileUpdate {
  id: number
  firstname: string
  lastname: string
  phone: string
  country_iso: string
}

export interface IUserUpdateResponse {
  user: User
}

export type Props = {
  children: ReactNode
}
