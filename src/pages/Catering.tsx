import Now from "../components/Now"
import { useAirport } from "../hooks/useAirport"
import { useAuth } from "../hooks/useAuth"
import { useCompany } from "../hooks/useCompany"
import {
  useGetContractsQuery,
  useSignContractMutation,
  useRejectContractMutation,
} from "../store/contracts/contract.api"
import { Contract } from "../types/company.types"

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
  const [signContractQuery] = useSignContractMutation()
  const [rejectContractQuery] = useRejectContractMutation()

  async function handleAccept(id: number) {
    const response = await signContractQuery({ id, user: user.id }).unwrap()
  }
  async function handleReject(id: number) {
    const response = await rejectContractQuery({ id }).unwrap()
  }

  return (
    <div className="w-full text-xl px-2 relative">
      <Now />
      <div className="w-full text-center text-2xl md:text-3xl font-bold">INFLIGHT SUPPLY PROVISION</div>
      <div className="uppercase font-semibold max-w-max mt-8 md:mt-0">
        {airport.name ? airport.name + " - " + airport.iata : "AIRPORT NOT SELECTED"}
      </div>
      {!airport.name && <span>Select an airport on the AIRPORTS tab</span>}

      {contracts && contracts.length > 0 && (
        <div className="max-w-max my-2">
          <div className="">
            <div className="only:hidden mt-4">Contracts on pending:</div>
            {contracts.map(
              (contract: Contract) =>
                !contract.signed_at && (
                  <ul key={contract.id} className="px-2">
                    <li className="m-2 md:flex">
                      <div className="flex">{`The contract with ${contract.name} (${contract.iata}) is awaiting approval and signing.`}</div>
                      <div className="text-slate-200 flex justify-end">
                        <button
                          onClick={() => handleReject(contract.id)}
                          className="flex max-w-max py-1 px-4 md:mx-4 justify-between items-center bg-red-700 rounded-full opacity-80 hover:opacity-100 active:scale-90 active:shadow-none shadow-md dark:shadow-slate-600"
                        >
                          <i className="fas fa-file-circle-xmark pr-4" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleAccept(contract.id)}
                          className="flex max-w-max py-1 px-4 justify-between items-center bg-teal-800 rounded-full opacity-80 hover:opacity-100 active:scale-90 active:shadow-none shadow-md dark:shadow-slate-600"
                        >
                          <i className="fas fa-file-circle-check pr-4" />
                          <span>Accept</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                ),
            )}
          </div>

          <div className="max-w-max">
            <div className="only:hidden mt-4">Contracts in force:</div>
            {contracts.map(
              (contract: Contract) =>
                contract.signed_at && (
                  <ul key={contract.id}>
                    <li className="flex m-2 rounded-full hover:bg-teal-700 hover:text-slate-200 px-2 cursor-pointer py-1">
                      <span>
                        {`The contract with ${contract.name} is in force from ${new Date(
                          contract.signed_at,
                        ).toDateString()}`}
                      </span>
                    </li>
                  </ul>
                ),
            )}
          </div>
        </div>
      )}
      {!contracts || (contracts.length === 0 && <div>No contracts yet.</div>)}
    </div>
  )
}
