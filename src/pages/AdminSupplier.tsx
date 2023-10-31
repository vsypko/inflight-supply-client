import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState, MouseEvent, RefObject } from "react"
import ImgEditor from "../components/ImgEditor"
import { Item } from "../types/company.types"
import { handleDataFileInput } from "../services/datafile.loader"
import { useAuth } from "../hooks/useAuth"
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

export default function AdminSupplier() {
  const [newItems, setNewItems] = useState<Item[]>([])
  const [editRow, setEditRow] = useState<Item | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [canvasRef, setCanvasRef] = useState<RefObject<HTMLCanvasElement> | null>(null)

  const { company } = useCompany()
  const { data, error } = useGetCompanyDataQuery({ type: "supplies", id: company.id })

  const initialItem: Item = {
    id: 0,
    code: 0,
    title: "",
    price: 0.0,
    category: "",
    area: "",
    description: "",
    img_url: "",
    co_id: company.id,
  }

  const headers = Object.keys(initialItem).slice(1, 7) as Array<keyof Item>
  const maxView = 200

  const handleError = (err: any): void => {
    setErrorMsg("")
    if (err != null && typeof err === "object" && "data" in err) setErrorMsg(err.data as string)
    if (err != null && typeof err === "object" && "error" in err) setErrorMsg(err.error as string)
  }

  useEffect(() => {
    if (error) handleError(error)
  }, [error])

  const [insertCompanyData, { isLoading }] = useInsertCompanyDataMutation()
  const [updateCompanyData] = useUpdateCompanyDataMutation()
  const [deleteItem] = useDeleteCompanyDataMutation()
  const [response, setResponse] = useState("")
  const [imgUpdateQuery] = useImgUrlUpdateMutation()
  const [imgRemoveQuery] = useImgUrlRemoveMutation()

  const [imgEditorProps, setImgEditorProps] = useState({
    path: "company/items/img/",
    url: editRow?.img_url,
    id: editRow?.id,
    imgLoaded,
    setImgLoaded,
    imgUpdateQuery,
    imgRemoveQuery,
    setCanvasRef,
  })

  const handleEditItem = (row: Item) => {
    if (canvasRef && editRow && row.id !== editRow.id) imageClear(canvasRef, maxView)
    setEditRow(row)
    setErrorMsg("")
  }

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = event.target.value
    if (event.target.name === "price") {
      if (value && isNaN(Number(value))) {
        event.preventDefault()
        return
      }
      if (value.includes(".") && value.split(".")[1] && value.split(".")[1].length > 2) {
        event.preventDefault()
        return
      }
    }
    setEditRow((row) => ({ ...(row as Item), [event.target.name]: value }))
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("")
    handleDataFileInput(e, headers, setNewItems)
  }

  const handleInsertItems = async () => {
    try {
      const values = newItems
        .map(
          (row) =>
            `(${row.code},'${row.title}', ${row.price}, '${row.category}', '${row.area}', '${row.description}', '${row.img_url}, ${row.co_id}')`,
        )
        .join(",")
      await insertCompanyData({ type: "supplies", values }).unwrap()
      setNewItems([])
    } catch (err) {
      setNewItems([])
      handleError(err)
    }
  }

  const handleAddItem = async () => {
    let imgUrl = ""
    if (imgLoaded) imgUrl = crypto.randomUUID()
    try {
      const values = `(${editRow?.code},'${editRow?.title}', ${editRow?.price}, '${editRow?.category}', '${editRow?.area}', '${editRow?.description}', '${imgUrl}', ${editRow?.co_id})`
      const res = await insertCompanyData({ type: "supplies", values }).unwrap()
      setResponse(res.data)

      if (!canvasRef || !imgLoaded) return
      await imageSave(canvasRef.current, maxView, imgUpdateQuery, imgUrl, res.id, "supplies")
      setEditRow((row) => ({ ...(row as Item), id: res.id, img_url: imgUrl }))
    } catch (err) {
      handleError(err)
    }
  }

  const handleUpdateItem = async () => {
    let imgUrl = ""
    if (imgLoaded) imgUrl = crypto.randomUUID()
    try {
      const res = await updateCompanyData({
        type: "supplies",
        id: editRow!.id,
        value: { ...editRow, img_url: imgUrl },
      }).unwrap()
      setResponse(res.data)
      if (!canvasRef || !imgLoaded) return
      await imageSave(canvasRef.current, maxView, imgUpdateQuery, imgUrl, editRow?.id, "supplies")
      setEditRow((row) => ({ ...(row as Item), img_url: imgUrl }))
    } catch (err) {
      handleError(err)
    }
  }

  const handleDeleteItem = async () => {
    if (editRow && editRow.id) {
      const answer = confirm(`Please confirm deletion of ${editRow.title}.`)
      if (!answer) return
      const res = await deleteItem({ type: "supplies", id: editRow.id }).unwrap()
      setResponse(res.data)
      setEditRow(null)
    }
  }

  const handleImgRemove = async () => {
    if (canvasRef) imageClear(canvasRef, maxView)
    if (editRow?.img_url) {
      const res = await imgRemoveQuery({ type: "supplies", id: editRow.id }).unwrap()
      setResponse(res.data)
      setEditRow((row) => ({ ...(row as Item), img_url: "" }))
    }
    setImgLoaded(false)
  }

  useEffect(() => {
    setImgEditorProps((props) => ({
      ...props,
      id: editRow?.id,
      url: editRow?.img_url,
      imgLoaded,
    }))
  }, [imgLoaded, editRow?.id, editRow?.img_url])

  return (
    <div className="w-full">
      <div className="block md:flex p-2 m-1 max-h-max">
        <div className="w-full md:w-1/4 md:text-2xl">
          <h1>Supplier</h1>
        </div>
        <div className="flex text-xl w-full justify-center">
          <div className="block w-full max-w-max relative">
            {errorMsg && <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>}
            {!newItems.length && !isLoading && (
              <div className="flex text-lg justify-between items-center">
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

            {/* Chart render in case of loading from file ----------------------------------------------------------------------------*/}
            {newItems.length != 0 && !isLoading && <SaveRemove setNew={setNewItems} handleSave={handleInsertItems} />}
            {newItems.length != 0 && !isLoading && <Chart headers={headers} data={newItems} height="max-h-[700px]" />}

            {/* Chart render in case of loading from database ------------------------------------------------------------------------*/}
            {data && !newItems.length && !isLoading && (
              <Chart
                headers={headers}
                data={data}
                height="max-h-[185px]"
                mdheight="md:max-h-[400px]"
                handleEdit={handleEditItem}
              />
            )}

            <div className="flex m-1 text-base absolute">
              {response && (
                <h5 onAnimationEnd={() => setResponse("")} className="text-teal-500 whitespace-pre-line result">
                  {response}
                </h5>
              )}
            </div>

            {/* Item editor ------------------------------------------------------------------------------------------------------------------- */}
            {editRow && (
              <>
                <div className="flex flex-col md:pt-10 md:flex-row w-full border-slate-600 border-b text-lg py-2 justify-between relative">
                  {/* cancel button  (xmark) ------------------------------------------------------------------------------------------------- */}
                  <button
                    type="button"
                    onClick={() => {
                      setImgLoaded(false)
                      setEditRow(null)
                    }}
                    className="absolute z-10 py-1 px-3.5 top-2 right-0 rounded-full hover:bg-slate-400 dark:hover:bg-slate-700 opacity-70 hover:opacity-100 active:scale-90"
                  >
                    <i className="fas fa-xmark text-2xl" />
                  </button>

                  {/* image editor------------------------------------------------------------------------------------------------------- */}
                  <div className="my-3">
                    <ImgEditor imgEditorProps={imgEditorProps} />
                  </div>

                  {/* Form for item editing -----------------------------------------------------------------------------------------------*/}
                  <div className="w-full flex flex-col md:pl-4 pb-4 mt-3">
                    {headers.slice(0, 5).map((key, index) => (
                      <div key={key} className="flex w-full text-xl relative mb-2">
                        <label htmlFor={key} className="w-1/3 md:w-1/4 capitalize font-semibold">
                          {key + ":"}
                        </label>
                        <input
                          id={key}
                          type="text"
                          name={key}
                          onChange={onChange}
                          value={
                            key === "price" && typeof editRow[key] === "number" ? editRow[key].toFixed(2) : editRow[key]
                          }
                          className={`w-2/3 md:w-3/4 bg-transparent opacity-70 focus:outline-none hover:opacity-100 focus:opacity-100 peer`}
                        />
                        {index === 2 && (
                          <span className="absolute left-[calc(100%/3-1rem)] md:left-[calc(100%/4-1rem)] opacity-70 peer-hover:opacity-100 peer-focus:opacity-100">
                            $
                          </span>
                        )}
                        <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-1/4 border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
                      </div>
                    ))}
                    <div className="flex w-full text-xl relative">
                      <label htmlFor="description" className="w-1/3 md:w-1/4 capitalize font-semibold">
                        Description:
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        onChange={onChange}
                        value={editRow["description"]}
                        className={`w-2/3 md:w-3/4 bg-transparent opacity-70 focus:outline-none hover:opacity-100 focus:opacity-100 overflow-auto peer`}
                      />
                      <div className="absolute w-0 transition-all duration-300 ease-in-out left-1/3 md:left-[calc(100%*1/4)] border-slate-500 bottom-0 peer-focus:w-2/3 md:peer-focus:w-3/4 peer-focus:border-b" />
                    </div>
                  </div>
                </div>

                {/* Action button block --------------------------------------------------------------------------------------------*/}
                <div className="flex w-full text-sm justify-around md:justify-between mt-2 text-slate-200">
                  {imgLoaded && (
                    <div className="w-full">
                      <button
                        onClick={handleImgRemove}
                        type="button"
                        className="py-1 px-3 rounded-full bg-slate-600 opacity-75 hover:opacity-100 active:scale-90"
                      >
                        <i className="fas fa-trash-can mr-2" />
                        <span>REMOVE IMAGE</span>
                      </button>
                    </div>
                  )}
                  <div className="w-full flex justify-end">
                    {editRow.id !== 0 && (
                      <>
                        <button
                          onClick={handleUpdateItem}
                          type="button"
                          className="py-1 px-3 rounded-full bg-slate-600 opacity-75 hover:opacity-100 active:scale-90"
                        >
                          <i className="fas fa-rotate mr-2" />
                          <span>UPDATE</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDeleteItem}
                          className="py-1 px-3 mx-2 rounded-full bg-red-700 opacity-75 hover:opacity-100 active:scale-90"
                        >
                          <i className="fas fa-trash-can mr-2" />
                          <span>DELETE</span>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="py-1 px-3 rounded-full bg-teal-800 opacity-70 hover:opacity-100 active:scale-90"
                    >
                      <i className="fas fa-plus mr-2" />
                      <span>NEW</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
