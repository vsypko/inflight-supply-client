import mapgl from "mapbox-gl"
import { useLazySearchAirportbyCodeQuery } from "../store/airport/airport.api"
import { useActions } from "../hooks/actions"
import { useEffect, useRef } from "react"
import { useAirport } from "../hooks/useAirport"

export default function Map() {
  mapgl.accessToken = import.meta.env.VITE_MAP_TOKEN
  const { airport } = useAirport()
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const [getAirport, { data, error }] = useLazySearchAirportbyCodeQuery()
  const { selectAirport } = useActions()
  useEffect(() => {
    if (data) {
      selectAirport(data.airports[0])
    }
  }, [data])

  useEffect(() => {
    if (mapContainer.current) {
      const mapbox = new mapgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [airport.longitude || 30, airport.latitude || 40],
        pitch: airport.id ? 60 : 0,
        bearing: 0,
        zoom: airport.id ? 15 : 1,
      })

      mapbox.on("style.load", (e) => {
        mapbox.addLayer({
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#AAA",
            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
            "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
            "fill-extrusion-opacity": 0.5,
          },
        })
      })
      mapbox.on("mousemove", (e) => {
        const features = mapbox.queryRenderedFeatures(e.point)
        if (features[0] && features[0].properties?.maki === "airport") {
          mapbox.getCanvas().style.cursor = "pointer"
        } else mapbox.getCanvas().style.cursor = ""
      })

      mapbox.on("click", (e) => {
        let features = mapbox.queryRenderedFeatures(e.point)
        getAirport(features[0].properties?.ref, false).unwrap()
      })
    }
  }, [airport, mapContainer])

  return <div ref={mapContainer} className="w-full h-[600px] border border-slate-600 mt-4 rounded-lg shadow-xl" />
}
