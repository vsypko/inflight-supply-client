export interface Airport {
  id: number | undefined
  type_ap: string | undefined
  name: string | undefined
  latitude: number | undefined
  longitude: number | undefined
  elevation_ft: number | undefined
  continent: string | undefined
  country: string | undefined
  country_iso: string | undefined
  iso_region: string | undefined
  municipality: string | undefined
  scheduled: string | undefined
  icao: string | undefined
  iata: string | undefined
  home_link: string | undefined
}
export interface IAirportResponse {
  total_count: number
  airports: Airport[]
}
export interface IAirportSchedule {
  iata: string
  flight: number
  departure: string
  arrival: string
  to: string
  from: string
}
