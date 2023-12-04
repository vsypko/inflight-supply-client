import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { Contract } from "../types/company.types"

import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery } from "../store/contracts/contract.api"
import SupplierSelector from "../components/SupplierSelector"

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { data: contracts } = useGetContractsQuery(
    { airport: airport.id, company: company.id, category: company.category },
    {
      skip: !airport.id || !company.id || company.category === "supplier",
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

      {contracts && contracts.length > 0 && (
        <div>
          {contracts[0].signed_at && (
            <div>
              {`The contract with ${contracts[0].name} is in force from 
                      ${new Date(contracts[0].signed_at).toDateString()} 
                    `}
            </div>
          )}
          {!contracts[0].signed_at && <div>{`The contract with ${contracts[0].name} is pending...`}</div>}
        </div>
      )}
      {!contracts || (contracts.length === 0 && <SupplierSelector />)}
    </div>
  )
}
