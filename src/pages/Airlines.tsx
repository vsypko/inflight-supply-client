import { useState } from 'react'
import AirlineContract from '../components/AirlineContracts'
import { useAirport } from '../hooks/useAirport'
import { useAuth } from '../hooks/useAuth'
import { useCompany } from '../hooks/useCompany'
import { useGetContractsQuery } from '../store/contracts/contract.api'
import { useGetFlightsQuery } from '../store/orders/orders.api'

export default function Airlines() {
  const { airport } = useAirport()
  const { user } = useAuth()
  const { company } = useCompany()
  const { data: contracts } = useGetContractsQuery({
    airport: airport.id,
    company: company.id,
    category: company.category,
  })

  if (company.category === 'airline') {
    return <AirlineContract />
  }
  return <div>Airlines, registered for this airport:</div>
}
