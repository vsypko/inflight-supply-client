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
