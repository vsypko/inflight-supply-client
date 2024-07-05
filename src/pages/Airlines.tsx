import AirlineContract from '../components/AirlineContracts'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'

export default function Airlines() {
  const { company } = useCompany()
  if (company && company.category === 'airline') {
    return <AirlineContract />
  }
  return <div>Airlines, registered for this airport:</div>
}
