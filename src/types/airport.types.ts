export interface IAirport {
  ap_id: number
  ap_type: string
  ap_name: string
  ap_latitude: number
  ap_longitude: number
  ap_elevation_ft: number
  ap_continent: string
  ap_country: string
  ap_iso_country: string
  ap_iso_region: string
  ap_municipality: string
  ap_scheduled: string
  ap_icao_code: string | null
  ap_iata_code: string | null
  ap_home_link: string | null
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
