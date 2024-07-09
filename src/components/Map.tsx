import mapboxgl, { MapMouseEvent, MapTouchEvent } from 'mapbox-gl'
import { useLazySearchAirportByCodeQuery } from '../store/airport/airport.api'
import { useActions } from '../hooks/actions'
import { useEffect, useRef } from 'react'
import { useAirport } from '../hooks/useAirport'

export default function Map() {
  mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN
  const { airport } = useAirport()
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const [getAirport, { data, error }] = useLazySearchAirportByCodeQuery()
  const { selectAirport } = useActions()

  useEffect(() => {
    if (data && data.airports[0]) {
      selectAirport(data.airports[0])
    }
  }, [data])

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [airport.longitude || 30, airport.latitude || 40],
        pitch: airport.id ? 60 : 0,
        bearing: 0,
        zoom: airport.id ? 15 : 1,
      })

      map.on('style.load', (e) => {
        map.addLayer({
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#BBD',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.8,
          },
        })
      })

      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point)
        if (features[0] && features[0].properties?.maki === 'airport') {
          map.getCanvas().style.cursor = 'pointer'
        } else map.getCanvas().style.cursor = 'default'
      })

      async function selectHandler(e: MapMouseEvent | MapTouchEvent) {
        const features = map.queryRenderedFeatures(e.point)
        const airportLabel = features.find(
          (item) => item.sourceLayer === 'airport_label'
        )
        let airportCode: string = ''
        if (airportLabel?.properties?.ref)
          airportCode = airportLabel.properties.ref

        if (airportCode && airportCode !== airport.iata)
          await getAirport(airportCode, true).unwrap()
      }

      map.on('click', async (e: MapMouseEvent) => selectHandler(e))
      map.on('touchstart', async (e: MapTouchEvent) => selectHandler(e))
    }
  }, [airport, mapContainer])

  return (
    <div
      ref={mapContainer}
      className="w-full h-[600px] border border-slate-600 mt-4 rounded-lg shadow-xl"
    />
  )
}
