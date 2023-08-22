import mapgl from "mapbox-gl"
import { IAirport } from "../types/airport.types"
import { useLazySearchAirportbyCodeQuery } from "../store/airport/airport.api"
import { useAppSelector } from "../hooks/redux"
import { useActions } from "../hooks/actions"
import { useEffect, useRef } from "react"

export default function Map() {
  mapgl.accessToken = import.meta.env.VITE_MAP_TOKEN
  const { selected } = useAppSelector((state) => state.airport)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const [getAirport, { data, error }] = useLazySearchAirportbyCodeQuery()
  const { selectAirport } = useActions()
  useEffect(() => {
    if (data) {
      selectAirport(data.airports[0])
    }
  }, [data])

  useEffect(() => {
    const mapbox = new mapgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [selected?.ap_longitude || 30, selected?.ap_latitude || 40],
      pitch: selected ? 60 : 0,
      bearing: 0,
      zoom: selected ? 15 : 1,
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
  }, [selected])

  return <div ref={mapContainer} className="w-full h-[500px] border border-slate-600 mt-4 rounded-lg" />
}
