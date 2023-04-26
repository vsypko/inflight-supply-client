export interface IFlight {
  id: number
  date: string
  flight: number
  acType: string
  acReg: string
  from: string
  to: string
  std: string
  sta: string
  seats: number
}

export interface IFleet {
  id: number
  name: string
  acType: string
  acReg: string
  seats: number
}
