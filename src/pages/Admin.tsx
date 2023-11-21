import AdminAirline from "./AdminAirline"
import AdminSupplier from "./AdminSupplier"
import SuperAdmin from "./SuperAdmin"
import { useAuth } from "../hooks/useAuth"
import { useCompany } from "../hooks/useCompany"

export default function Admin() {
  const { user } = useAuth()
  const { company } = useCompany()
  return (
    <>
      {user.role === "superadmin" && <SuperAdmin />}
      {company.category === "airline" && <AdminAirline />}
      {company.category === "supplier" && <AdminSupplier />}
    </>
  )
}
