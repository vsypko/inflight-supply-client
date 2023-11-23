import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { IContract } from "../types/company.types"

import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery } from "../store/contracts/contract.api"
import SupplierSelector from "../components/SupplierSelector"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { data: contract } = useGetContractsQuery(
    { airport: airport.id, airline: company.id },
    {
      skip: !airport.id || !company.id,
      refetchOnFocus: true,
    },
  )

  return (
    <div className="w-full text-xl px-2">
      <div className="w-full text-center text-2xl md:text-3xl font-bold">INFLIGHT SUPPLY ORDERS</div>
      <div className="uppercase font-semibold">
        {airport.name ? airport.name + " - " + airport.iata : "AIRPORT NOT SELECTED"}
      </div>
      {!airport.name && <span>Select an airport on the AIRPORTS tab</span>}

      {contract && (
        <div>
          {contract && !contract.sighned_at && <div>{`The contract with ${contract.supplier} is pending...`}</div>}
        </div>
      )}

      {!contract && <SupplierSelector />}
    </div>
  )
}
