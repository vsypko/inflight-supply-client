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

export interface ICompany {
  id: number
  category: string
  name: string
  reg_number: string
  icao?: string
  iata?: string
  country: {
    iso: string
    title_case: string
    phonecode: number
    currency: string
    flag: string
  }
  city: string
  address: string
  link?: string
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
