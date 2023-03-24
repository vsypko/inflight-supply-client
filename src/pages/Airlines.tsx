import { useAppSelector } from "../hooks/redux"

export default function Airlines() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, token } = useAppSelector((state) => state.auth)

  return (
    <div>
      Airlines Page
      <div>{selected?.ap_country}</div>
      <div>{selected?.ap_municipality}</div>
      <div>{selected?.ap_name}</div>
      <div>{selected?.ap_iata_code}</div>
      <div>{user?.usr_email}</div>
      <div>role: {user?.usr_role_name}</div>
      <div>token: {token}</div>
    </div>
  )
}
