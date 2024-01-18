import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { useGetContractsQuery } from '../store/contracts/contract.api'
import { Contract } from '../types/company.types'
import FlightsSelector from './FlightsSelector'
import Order from './Order'
import Orders from './Orders'
import SupplierSelector from './SupplierSelector'

export default function AirlineContract() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()

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

  return (
    <div className="w-full px-2">
      <div className="w-full text-center text-2xl md:text-3xl font-bold">
        INFLIGHT SUPPLY ORDERS
      </div>

      <div className="md:flex md:justify-between">
        <div className="font-semibold text-amber-600">
          {airport.name
            ? airport.name.toUpperCase() + ' - ' + airport.iata
            : 'AIRPORT NOT SELECTED: Select an airport on the AIRPORTS tab'}
        </div>

        <div>
          {contracts && contracts[0] && contracts[0].signed_at && (
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
          <div className="w-full md:w-3/5">
            <Orders supplierId={contracts[0].supplier} />
          </div>
        </div>
      )}

      {/* <div className="w-full md:w-1/5">
          <Order order={{ leg: 0 }} />
        </div> */}
    </div>
  )
}
