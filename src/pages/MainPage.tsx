import { RefObject, useEffect, useRef, useState } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useLazySearchAirportbyCodeQuery } from "../store/airport/airport.api"
import Dropdown from "../components/DropdownData"
import { useDebounce } from "../hooks/debounce"
import { useAppSelector } from "../hooks/redux"
import { useActions } from "../hooks/actions"
import Search from "../components/Search"
import mapgl from "mapbox-gl"

export default function MainPage() {
  mapgl.accessToken = import.meta.env.VITE_MAP_TOKEN
  const { selected } = useAppSelector((state) => state.airport)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const [getAirport, { data, error }] = useLazySearchAirportbyCodeQuery()
  const { selectAirport } = useActions()
  // const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (data) {
      // setErrorMsg("")
      selectAirport(data.airports[0])
    }
    // if (error) {
    //   if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
    //   if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    // }
  }, [
    data,
    // error
  ])

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
          "fill-extrusion-color": "#789AAA",
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
          "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
          "fill-extrusion-opacity": 0.6,
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

  return (
    <div className="w-full mt-6 px-3 md:flex">
      <div className="w-full md:w-1/3 flex flex-col">
        <Search />
        <div ref={mapContainer} className="w-full h-[500px] border border-slate-600 mt-2" />
      </div>
      <div className="w-full md:w-2/3 flex flex-col md:px-2">
        <div className="w-full h-[400px] border border-slate-600 mt-2">
          <></>
        </div>
        <div className="w-full h-[300px] border border-slate-600 mt-2">Flight details</div>
      </div>
    </div>
  )
}
