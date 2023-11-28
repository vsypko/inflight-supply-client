import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { useCompany } from "../hooks/useCompany"
import { useGetContractsQuery } from "../store/contracts/contract.api"
import { IContract } from "../types/company.types"

export default function Catering() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { data: contracts } = useGetContractsQuery(
    { airport: airport.id, company: company.id, category: company.category },
    {
      skip: !airport.id || !company.id,
      refetchOnFocus: true,
    },
  )
  return (
    <div className="w-full text-xl px-2">
      <div className="w-full text-center text-2xl md:text-3xl font-bold">INFLIGHT SUPPLY PROVISION</div>
      <div className="uppercase font-semibold">
        {airport.name ? airport.name + " - " + airport.iata : "AIRPORT NOT SELECTED"}
      </div>
      {!airport.name && <span>Select an airport on the AIRPORTS tab</span>}

      {contracts && contracts.length > 0 && (
        <div>
          {contracts.map((contract: IContract) => (
            <div key={contract.id}>
              {!contract.signed_at && (
                <div>{`The contract with ${contract.airline} is awaiting approval and signing.`}</div>
              )}
              {contract.signed_at && <div>{`The contract with ${contract.airline} is in force.`}</div>}
            </div>
          ))}
        </div>
      )}
      {!contracts || (contracts.length === 0 && <div>No contracts yet.</div>)}
    </div>
  )
}
