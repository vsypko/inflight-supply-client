import SupplierContracts from '../components/SupplierContracts'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { useGetCompaniesForAirportQuery } from '../store/company/company.api'
import { Company } from '../types/company.types'

export default function Suppliers() {
  const { user } = useAuth()
  const { company } = useCompany()
  const { airport } = useAirport()

  const { data: suppliers } = useGetCompaniesForAirportQuery(
    { type: 'supplier', airport: airport.id },
    {
      skip: !airport.id,
      refetchOnFocus: true,
    }
  )
  if (airport.id) {
    if (
      user.id &&
      user.role !== 'user' &&
      company.id &&
      company.category === 'supplier'
    ) {
      return <SupplierContracts />
    }

    return (
      <div>
        <div className="ml-4">Suppliers, registered for this airport:</div>
        {suppliers?.map((supplier: Company) => (
          <div key={supplier.id} className="ml-4">
            {supplier.name}
          </div>
        ))}
      </div>
    )
  }

  return <div className="w-full flex ml-3">No airport selected</div>
}
