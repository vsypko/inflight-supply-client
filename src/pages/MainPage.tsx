import Search from "../components/Search"
import Map from "../components/Map"
import Schedule from "../components/Schedule"

export default function MainPage() {
  return (
    <div className="w-full mt-6 px-3 md:flex">
      <div className="w-full md:w-1/3 flex flex-col">
        <Search />
        <Map />
      </div>
      <div className="w-full md:w-2/3 h-full flex flex-col md:px-10">
        <Schedule />
      </div>
    </div>
  )
}
