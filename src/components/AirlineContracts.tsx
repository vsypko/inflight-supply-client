import { useEffect } from 'react'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { useGetContractsQuery } from '../store/contracts/contract.api'
import FlightsSelector from './FlightsSelector'
import Orders from './Orders'
import SupplierSelector from './SupplierSelector'
import { useActions } from '../hooks/actions'
import Now from '../components/Now'

export default function AirlineContract() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { setContract } = useActions()

  const { data: contracts } = useGetContractsQuery(
    {
      airport: airport.id,
      company: company.id,
      category: company.category,
    },
    {
      skip: !airport.id || !company.id || company.category === 'supplier',
      refetchOnFocus: true,
    }
  )

  useEffect(() => {
    if (contracts && contracts.length > 0 && contracts[0].signed_at)
      setContract(contracts[0])
  }, [contracts])

  return (
    <div className="w-full px-2 relative">
      <div className="w-full text-center text-2xl md:text-3xl font-bold mt-2">
        INFLIGHT SUPPLY ORDERS
      </div>
      <div className="md:absolute left-0 top-8 md:top-0 text-xs md:text-base font-light">
        <Now />
      </div>
      <div className="md:flex md:justify-between">
        <div className="font-semibold text-amber-600">
          {airport.name
            ? airport.name.toUpperCase() + ' - ' + airport.iata
            : 'AIRPORT NOT SELECTED: Select an airport on the AIRPORTS tab'}
        </div>

        {contracts && contracts.length > 0 && contracts[0].signed_at && (
          <div className="normal-case">
            {'The contract with '}
            <span className="text-amber-600">{contracts[0].name}</span>
            {' is in force from '}
            <span className="text-amber-600">
              {new Date(contracts[0].signed_at).toDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="w-full md:flex">
        {contracts && contracts.length < 1 && <SupplierSelector />}
      </div>
      {contracts && contracts.length > 0 && !contracts[0].signed_at && (
        <div>{`The contract with ${contracts[0].name} is pending...`}</div>
      )}

      {contracts && contracts.length > 0 && contracts[0].signed_at && (
        <div className="w-full md:flex">
          <div className="w-full md:w-1/5">
            <FlightsSelector />
          </div>
          <div className="w-full md:w-4/5 mt-4">
            <Orders />
          </div>
        </div>
      )}
    </div>
  )
}
