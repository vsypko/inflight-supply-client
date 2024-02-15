import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { airportActions } from '../store/airport/airport.slice'
import { authActions } from '../store/auth/auth.slice'
import { companyActions } from '../store/company/company.slice'
import { orderActions } from '../store/orders/order.slice'

const actions = {
  ...airportActions,
  ...authActions,
  ...companyActions,
  ...orderActions,
}
export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
