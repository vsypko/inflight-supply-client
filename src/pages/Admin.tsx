import AdminAirline from "../components/AdminAirline"
import AdminSupplier from "../components/AdminSupplier"
import SuperAdmin from "../components/SuperAdmin"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"

export default function Admin() {
  const { user, company } = useAppSelector((state) => state.auth)
  return (
    <>
      {user?.usr_role_name === "superadmin" && <SuperAdmin />}
      {company?.co_category === "airline" && <AdminAirline />}
      {company?.co_category === "supplier" && <AdminSupplier />}
    </>
  )
}
