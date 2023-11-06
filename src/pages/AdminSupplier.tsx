import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState, MouseEvent, RefObject } from "react"
import ImgEditor from "../components/ImgEditor"
import { Item } from "../types/company.types"
import { handleDataFileInput } from "../services/datafile.loader"
import { v4 as uuid } from "uuid"
import {
  useDeleteCompanyDataMutation,
  useGetCompanyDataQuery,
  useImgUrlUpdateMutation,
  useInsertCompanyDataMutation,
  useImgUrlRemoveMutation,
  useUpdateCompanyDataMutation,
} from "../store/company/company.api"
import Chart from "../components/Chart"
import SaveRemove from "../components/SaveRemove"
import { imageSave } from "../services/imagefile.loader"
import { imageClear } from "../services/image.utils"
import { useCompany } from "../hooks/useCompany"
import { useAirport } from "../hooks/useAirport"
import { useDebounce } from "../hooks/debounce"
import { useSearchAirportQuery } from "../store/airport/airport.api"
import SearchDropdown from "../components/SearchDropdown"
import SupplierItems from "../components/SupplierItems"
import SupplierAirports from "../components/SupplierAirports"

export default function AdminSupplier() {
  const { company } = useCompany()
  return (
    <div className="w-full">
      <div className="block md:flex p-2 m-1 max-h-max">
        <div className="w-full md:w-1/3 md:text-2xl mt-6">
          <div className="flex justify-between p-3">
            <h1>Company:</h1>
            <span className="font-bold">{company.name}</span>
          </div>
          <div className="flex justify-between p-3">
            <h1>Country:</h1>
            <div className="flex">
              <span className="font-bold">{company.country}</span>
              <img src={`data:image/png;base64, ${company.flag}`} alt="" className="py-1" />
            </div>
          </div>
          <div className="p-3 flex w-full justify-between"> Airports where services are provided:</div>
          <SupplierAirports />
        </div>
        <div className="flex text-xl w-2/3 justify-center">
          <SupplierItems />
        </div>
      </div>
    </div>
  )
}
