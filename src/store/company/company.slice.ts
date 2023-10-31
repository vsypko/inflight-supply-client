import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Company } from "../../types/company.types"

interface CompanyState {
  company: Company
}

const initialState: CompanyState = {
  company: {
    id: undefined,
    category: "",
    name: "",
    reg_number: "",
    icao: "",
    iata: "",
    country_iso: "",
    country: "",
    city: "",
    address: "",
    link: "",
    flag: "",
    currency: "",
  },
}

export const companySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCompany(state, { payload: company }: PayloadAction<Company>): void {
      state.company = company
    },
    removeCompanyFromState(state) {
      state.company = initialState.company
    },
  },
})

export const companyActions = companySlice.actions
export const companyReducer = companySlice.reducer
export const { setCompany, removeCompanyFromState } = companySlice.actions
