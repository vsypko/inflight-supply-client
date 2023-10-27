export interface IFlight {
  id: number
  date: string
  flight: number
  type: string
  reg: string
  from: string
  to: string
  std: string
  sta: string
  seats: number
  co_id: number
  co_iata: string
}

export interface IFleet {
  id: number
  name: string
  type: string
  reg: string
  seats: number
  co_id: number
}

export interface ISchedule {
  departure?: string
  arrival?: string
  destination: string
  flight: string
}

export interface IUpdatePayload<T> {
  type: string
  id: number
  value: T | null
}
export interface IAddPayload {
  type: string
  values: string
}
export interface IDeletePayload {
  type: string
  id: number
}
export interface IRow {
  id: number
  date?: string
  flight?: number
  type?: string
  reg?: string
  from?: string
  to?: string
  std?: string
  sta?: string
  seats?: number
  co_id?: number
  co_iata?: string
  name?: string
}

export interface Company {
  id: number | undefined
  category: string | undefined
  name: string | undefined
  reg_number: string | undefined
  icao?: string | undefined
  iata?: string | undefined
  country_iso: string | undefined
  country: string | undefined
  city: string | undefined
  address: string | undefined
  link: string | undefined
  currency: string | undefined
  flag: string | undefined
}

export interface Item {
  id: number
  code: number
  title: string
  price: number
  category: string
  area: string
  description: string
  img_url: string
  co_id: number
}

export interface ICompanyResponse {
  total_count: number
  companies: Company[]
}
