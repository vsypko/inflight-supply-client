// import Map from "../components/Map"
import AirportSelector from "../components/AirportSelector"
import AirportSchedule from "../components/AirportSchedule"

export default function MainPage() {
  return (
    <div className="mt-6 px-3 md:flex relative">
      <div className="w-full md:w-1/3 flex flex-col bg-transparent z-10">
        <AirportSelector />
        {/* <Map /> */}
      </div>
      <AirportSchedule />
    </div>
  )
}
