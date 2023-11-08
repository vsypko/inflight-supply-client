import { useCompany } from "../hooks/useCompany"
import SupplierItems from "../components/SupplierItems"
import SupplierAirports from "../components/SupplierAirports"

export default function AdminSupplier() {
  const { company } = useCompany()
  return (
    <div className="w-full px-2">
      <div className="block md:flex max-h-max">
        <div className="w-full md:w-1/3 md:text-xl mt-10">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Company:</span>
            <span>{company.name}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Country:</span>
            <div className="flex">
              <span className="mr-2">{company.country}</span>
              <img src={`data:image/png;base64, ${company.flag}`} alt="" className="py-1" />
            </div>
          </div>
          <div className="flex mb-2 font-semibold"> Airports where services are provided:</div>
          <SupplierAirports />
        </div>
        <div className="text-xl w-full md:w-2/3 justify-center md:flex">
          <SupplierItems />
        </div>
      </div>
    </div>
  )
}
