import { ChangeEvent, useEffect, useState } from "react"
import ImgEditor from "../components/ImgEditor"
import { Item } from "../types/supplier.types"
import { handleDataFileInput } from "../services/datafile.loader"
import { useAuth } from "../hooks/useAuth"
import { useGetCompanyDataQuery, useInsertCompanyDataMutation } from "../store/company/company.api"
import Table from "../components/Table"
import SaveRemove from "../components/SaveRemove"

const initialItem: Item = {
  id: 0,
  code: 0,
  name: "",
  category: "",
  area: "",
  description: "",
  img_url: "",
}
const headers = Object.keys(initialItem).slice(1, 6) as Array<keyof Item>

export default function AdminSupplier() {
  const [items, setitems] = useState<Item[]>([initialItem])
  const [itemImgEdit, setItemImgEdit] = useState(false)
  const [newItems, setNewItems] = useState<Item[]>([])
  const [editRow, setEditRow] = useState<Item>(initialItem)
  const [errorMsg, setErrorMsg] = useState("")

  const { company } = useAuth()
  const { data, error } = useGetCompanyDataQuery({ tbType: "supplies", tbName: company!.co_tb_1 })
  const [insertCompanyData, { data: response, isError, isSuccess, isLoading }] = useInsertCompanyDataMutation()

  const handleEditItem = (row: Item) => {
    setEditRow(row)
    setErrorMsg("")
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleDataFileInput(e, headers, setNewItems)
  }

  async function handleItemsInsert() {
    try {
      const values = newItems
        .map((row) => `(${row.code},'${row.name}', '${row.category}', '${row.area}', '${row.description}')`)
        .join(",")
      await insertCompanyData({ tbType: "supplies", tbName: company!.co_tb_1, values }).unwrap()
      setNewItems([])
    } catch (err) {
      setNewItems([])
      if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
      if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
    }
  }

  useEffect(() => {
    setErrorMsg("")
    if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
    if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
  }, [error])

  // const imgEditorProps = {
  //   path: "company/geturl/",
  //   url: user?.usr_url,
  //   id: user?.id,
  //   setImageEdit: setItemImgEdit,
  //   imgUpdateQuery: itemImgUrlUpdateQuery,
  //   imgRemoveQuery: itemImgUrlRemoveQuery,
  //   imgUrlUpdateAction: updateItemImgUrl,
  // }

  const [imageEdit, setImageEdit] = useState(false)
  return (
    <div className="w-full">
      <div className="block md:flex p-2 m-1 max-h-max">
        <div className="w-full md:w-1/4 md:text-2xl">
          <h1>Supplier</h1>
        </div>
        <div className="flex w-full">
          <div className="flex text-xl w-full justify-center">
            <div className="block w-full max-w-max">
              {errorMsg && <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>}
              {!newItems.length && !isLoading && (
                <div className="flex flex-col lg:flex-row text-lg justify-between items-center">
                  <div className="mb-2 md:mb-1">
                    <button
                      onClick={() => handleEditItem(initialItem)}
                      type="button"
                      className="px-2.5 py-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
                    >
                      <i className="fas fa-plus mr-2" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="mb-2 lg:mb-1">
                    <label
                      htmlFor="xlsxFileInput"
                      className="px-2.5 py-1.5 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
                    >
                      <i className="fas fa-upload mr-2" />
                      <span>Upload from file</span>
                    </label>
                    <input
                      id="xlsxFileInput"
                      name="xlsxFileInput"
                      type="file"
                      accept=".xlsx, .ods"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}

              {newItems.length != 0 && !isLoading && <SaveRemove setNew={setNewItems} handleSave={handleItemsInsert} />}
              {newItems.length != 0 && !isLoading && <Table headers={headers} data={newItems} />}
              {data && !newItems.length && !isLoading && (
                <Table headers={headers} data={data} handleEdit={handleEditItem} />
              )}

              <div className="flex w-full m-1 h-6">
                {response && <h5 className="text-teal-500 py-1 whitespace-pre-line result">{response.data}</h5>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
