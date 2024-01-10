import { IOrder } from '../types/company.types'
import { useCompany } from '../hooks/useCompany'

export default function Order({ order }: { order: IOrder }) {
  const { company } = useCompany()
  const { leg } = order
  return (
    <div className="flex flex-col items-center">
      <h1>ORDER</h1>
      <span>
        {'flight ' + company.iata + ' ' + leg.flight + ' to ' + leg.to}
      </span>
      <span>{leg.date + ' ' + leg.std}</span>
    </div>
  )
}
