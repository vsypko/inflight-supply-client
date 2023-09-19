export interface IAirport {
  id: number
  type_ap: string
  name: string
  latitude: number
  longitude: number
  elevation_ft: number
  continent: string
  country_name: string
  country: string
  iso_region: string
  municipality: string
  scheduled: string
  icao: string | null
  iata: string | null
  home_link: string | null
}
export interface IAirportResponse {
  total_count: number
  airports: IAirport[]
}
export interface IAirportSchedule {
  iata: string
  flight: number
  departure: string
  arrival: string
  to: string
  from: string
}
