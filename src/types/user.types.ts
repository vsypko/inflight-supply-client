import { ReactNode } from "react"

export interface IUser {
  usr_id: number
  usr_firstname: string | undefined
  usr_lastname: string | undefined
  usr_email: string
  role_name: string
  usr_photourl: string | undefined
  usr_phone: string | undefined
  co_name: string | undefined
  cn_phonecode: number
  cn_flag: string | undefined
}

export interface IUsersResponse {
  total_count: number
  users: IUser[]
}
export interface IUserUpdate {
  name: string
  surname: string
  photoUrl: string
}

export interface IAuthState {
  user: IUser | null
  token: string | null
}

export type Props = {
  children: ReactNode
}
