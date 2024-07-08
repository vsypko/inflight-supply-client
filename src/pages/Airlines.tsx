import AirlineContract from '../components/AirlineContracts'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { useGetCompaniesForAirportQuery } from '../store/company/company.api'
import { Company } from '../types/company.types'

export default function Airlines() {
  const { user } = useAuth()
  const { company } = useCompany()
  const { airport } = useAirport()

  const { data: airlines } = useGetCompaniesForAirportQuery(
    { type: 'airline', airport: airport.iata },
    {
      skip: !airport.id,
      refetchOnFocus: true,
    }
  )

  if (
    user.id &&
    user.role !== 'user' &&
    company.id &&
    company.category === 'airline'
  ) {
    return <AirlineContract />
  }

  if (airport.id) {
    return (
      <div>
        <div>Airlines, scheduled for this airport:</div>
        {airlines?.map((airline: Company) => (
          <div key={airline.id}>{airline.name}</div>
        ))}
      </div>
    )
  }

  return <div>No airport selected</div>
}
