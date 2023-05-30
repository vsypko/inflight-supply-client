import AdminAirline from "./AdminAirline"
import AdminSupplier from "./AdminSupplier"
import SuperAdmin from "../components/SuperAdmin"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"

export default function Admin() {
  const { user, company } = useAppSelector((state) => state.auth)
  return (
    <>
      {user?.role === "superadmin" && <SuperAdmin />}
      {company?.category === "airline" && <AdminAirline />}
      {company?.category === "supplier" && <AdminSupplier />}
    </>
  )
}
