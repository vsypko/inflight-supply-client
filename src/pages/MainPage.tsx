import Search from "../components/Search"
import Map from "../components/Map"
import Schedule from "../components/Schedule"

export default function MainPage() {
  return (
    <div className="mt-6 px-3 md:flex relative">
      <div className="w-full md:w-1/3 flex flex-col bg-transparent z-10">
        <Search />
        {/* <Map /> */}
      </div>
      <Schedule />
    </div>
  )
}
