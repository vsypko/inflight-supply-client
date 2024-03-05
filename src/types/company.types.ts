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
  order_id: string
}
export interface FlightSelected {
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
  crew: number
  fc: number
  bc: number
  yc: number
  order_id: string
}

export interface Fleet {
  id: number
  name: string
  type: string
  reg: string
  seats: number
  crew: number
  fc: number
  bc: number
  yc: number
  co_id: number | undefined
}

export interface Schedule {
  departure?: string
  arrival?: string
  destination: string
  flight: string
}

export interface Place {
  id: number
  airport_id: number
  name: string
  iata: string
  municipality: string
  country: string
  country_iso: string
  company_id: number
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
  fc?: number | undefined
  bc?: number | undefined
  yc?: number | undefined
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
  img_url: string | undefined
  co_id: number | undefined
}

export interface ICompanyResponse {
  total_count: number
  companies: Company[]
}

export interface Contract {
  id: number
  signed_at: string
  airline: number
  supplier: number
  airport: number
  airline_signatory: number
  supplier_signatory: number
  name: string
  reg_number: string
  iata: string
  country_iso: string
}
export interface Lading {
  item: Item
  persent: number
}

export interface IOrder {
  id: string | undefined
  contract: Contract | undefined
}

export interface IOrderItem {
  id: number | undefined
  orderId: string | undefined
  item: Item
  qty: number
  amount: number
  section: string
}
