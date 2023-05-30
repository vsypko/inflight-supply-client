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
}

export interface IFleet {
  id: number
  name: string
  type: string
  reg: string
  seats: number
}

export interface IUpdatePayload<T> {
  tbType: string
  tbName: string
  value: T | null
}
export interface IAddPayload {
  tbType: string
  tbName: string
  values: string
}
export interface IDeletePayload {
  tbType: string
  tbName: string
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
  table1: string
  table2: string
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
}
