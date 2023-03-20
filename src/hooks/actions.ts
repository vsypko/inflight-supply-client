import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { airportActions } from "../store/airport/airport.slice"
import { authActions } from "../store/auth/auth.slice"

const actions = { ...airportActions, ...authActions }
export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
