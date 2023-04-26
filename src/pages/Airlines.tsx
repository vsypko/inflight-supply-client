import { ChangeEvent, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { useAuth } from "../hooks/useAuth"
import { handleXLSXFileInput } from "../services/datafile.loader"

export default function Airlines() {
  const { selected } = useAppSelector((state) => state.airport)
  const { user, country, token } = useAuth()

  return (
    <div>
      Airlines Page
      <div>{selected?.ap_country}</div>
      <div>{selected?.ap_municipality}</div>
      <div>{selected?.ap_name}</div>
      <div>{selected?.ap_iata_code}</div>
      <div>{user?.usr_email}</div>
      <div>{user?.usr_firstname}</div>
      <div>{user?.usr_lastname}</div>
      <div className="flex">
        <span>+{user?.usr_cn === "ZZ" ? "" : country?.cn_phonecode}</span>
        <span>-{user?.usr_phone}</span>
      </div>
      <div>role: {user?.usr_role_name}</div>
    </div>
  )
}
