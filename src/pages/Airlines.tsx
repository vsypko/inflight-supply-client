import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"

export default function Airlines() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, token } = useAuth()

  return (
    <div>
      Airlines Page
      <div>{selected?.country}</div>
      <div>{selected?.municipality}</div>
      <div>{selected?.name}</div>
      <div>{selected?.iata}</div>
      <div>{user?.email}</div>
      <div>{user?.firstname}</div>
      <div>{user?.lastname}</div>
      <div className="flex">
        <span>+{user?.country === "ZZ" ? "" : country?.phonecode}</span>
        <span>-{user?.phone}</span>
      </div>
      <div>role: {user?.role}</div>
    </div>
  )
}
