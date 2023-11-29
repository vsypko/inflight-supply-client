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
      skip: !airport.id || !company.id || company.category === "airline",
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
        <div className="max-w-max">
          {contracts.map((contract: IContract) => (
            <div key={contract.id} className="p-4">
              {!contract.signed_at && (
                <div>{`The contract with ${contract.name} (${contract.iata}) is awaiting approval and signing.`}</div>
              )}
              {contract.signed_at && <div>{`The contract with ${contract.name} is in force.`}</div>}
              <div className="text-slate-200 flex w-full justify-end">
                <button className="flex max-w-max py-2 px-4 justify-between items-center bg-red-700 rounded-full opacity-80 hover:opacity-100 active:scale-90 active:shadow-none shadow-md dark:shadow-slate-600">
                  <i className="fas fa-file-circle-xmark pr-4" />
                  <span>Reject</span>
                </button>
                <button className="flex max-w-max py-2 px-4 mx-2 justify-between items-center bg-teal-800 rounded-full opacity-80 hover:opacity-100 active:scale-90 active:shadow-none shadow-md dark:shadow-slate-600">
                  <i className="fas fa-file-circle-check pr-4" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!contracts || (contracts.length === 0 && <div>No contracts yet.</div>)}
    </div>
  )
}
