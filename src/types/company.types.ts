export interface Flight {
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
  co_id: number | undefined
  co_iata: string | undefined
}

export interface Fleet {
  id: number
  name: string
  type: string
  reg: string
  seats: number
  co_id: number | undefined
}

export interface Schedule {
  departure?: string
  arrival?: string
  destination: string
  flight: string
}

export interface Row {
  id: number | undefined
  date?: string | undefined
  flight?: number | undefined
  type?: string | undefined
  reg?: string | undefined
  from?: string | undefined
  to?: string | undefined
  std?: string | undefined
  sta?: string | undefined
  seats?: number | undefined
  co_id?: number | undefined
  co_iata?: string | undefined
  name?: string | undefined
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
  co_id: number | undefined
}

export interface ICompanyResponse {
  total_count: number
  companies: Company[]
}
