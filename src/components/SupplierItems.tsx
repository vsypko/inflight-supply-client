import { ChangeEvent, useEffect, useState, RefObject } from 'react'
import ImgEditor from '../components/ImgEditor'
import { Item } from '../types/company.types'
import { handleDataFileInput } from '../services/datafile.loader'
import { v4 as uuid } from 'uuid'
import {
  useDeleteCompanyDataMutation,
  useGetCompanyDataQuery,
  useImgUrlUpdateMutation,
  useInsertCompanyDataMutation,
  useImgUrlRemoveMutation,
  useUpdateCompanyDataMutation,
} from '../store/company/company.api'
import Chart from '../components/Chart'
import SaveRemove from '../components/SaveRemove'
import { imageSave } from '../services/imagefile.loader'
import { imageClear } from '../services/image.utils'
import { useCompany } from '../hooks/useCompany'

export default function SupplierItems() {
  const { company } = useCompany()
  const { data: supplies, error } = useGetCompanyDataQuery({
    type: 'supplies',
    id: company.id,
  })

  const emptyRow: Item = {
    id: 0,
    code: 0,
    title: '',
    price: 0.0,
    category: '',
    area: '',
    description: '',
    img_url: undefined,
    co_id: company.id,
  }

  const headers = Object.keys(emptyRow).slice(1, 7)
  const maxView = 200

  const handleError = (err: any): void => {
    setErrorMsg('')
    if (err != null && typeof err === 'object' && 'data' in err)
      setErrorMsg(err.data as string)
    if (err != null && typeof err === 'object' && 'error' in err)
      setErrorMsg(err.error as string)
  }

  useEffect(() => {
    if (error) handleError(error)
  }, [error])

  const [row, setRow] = useState<Item>(emptyRow)
  const [editorOpened, setEditorOpened] = useState(false)
  const [newItems, setNewItems] = useState<Item[]>([])
  const [imgLoaded, setImgLoaded] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [canvasRef, setCanvasRef] =
    useState<RefObject<HTMLCanvasElement> | null>(null)
  const [response, setResponse] = useState('')

  const [insertCompanyData, { isLoading }] = useInsertCompanyDataMutation()
  const [updateCompanyData] = useUpdateCompanyDataMutation()
  const [deleteItem] = useDeleteCompanyDataMutation()
  const [imgUpdateQuery] = useImgUrlUpdateMutation()
  const [imgRemoveQuery] = useImgUrlRemoveMutation()

  const [imgEditorProps, setImgEditorProps] = useState({
    path: 'company/items/img/',
    url: row.img_url,
    id: row.id,
    imgLoaded,
    setImgLoaded,
    imgUpdateQuery,
    imgRemoveQuery,
    setCanvasRef,
  })

  const handleEditItem = (row: Item) => {
    if (canvasRef && !row.img_url) imageClear(canvasRef, maxView)
    setRow(row)
    setEditorOpened(true)
    setErrorMsg('')
  }

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = event.target.value
    if (event.target.name === 'price') {
      if (value && isNaN(Number(value))) {
        event.preventDefault()
        return
      }
      if (
        value.includes('.') &&
        value.split('.')[1] &&
        value.split('.')[1].length > 2
      ) {
        event.preventDefault()
        return
      }
    }
    setRow((row) => ({ ...row, [event.target.name]: value }))
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg('')
    handleDataFileInput(e, headers, setNewItems, company.id)
  }

  const handleInsertItems = async () => {
    try {
      await insertCompanyData({ type: 'supplies', values: newItems }).unwrap()
      setNewItems([])
    } catch (err) {
      setNewItems([])
      handleError(err)
    }
  }

  const handleAddItem = async () => {
    let imgUrl = ''
    if (imgLoaded) imgUrl = uuid()
    try {
      const res = await insertCompanyData({
        type: 'supplies',
        values: [row],
      }).unwrap()
      setResponse(res.data)
      if (!canvasRef || !imgLoaded) return
      await imageSave(
        canvasRef.current,
        maxView,
        imgUpdateQuery,
        imgUrl,
        res.id,
        'supplies'
      )
      setRow((row) => ({ ...row, id: res.id, img_url: imgUrl }))
    } catch (err) {
      handleError(err)
    }
  }

  const handleUpdateItem = async () => {
    let imgUrl = ''
    if (imgLoaded) imgUrl = uuid()
    try {
      const res = await updateCompanyData({
        type: 'supplies',
        id: row.id,
        value: { ...row, img_url: imgUrl },
      }).unwrap()
      setResponse(res.data)
      if (!canvasRef || !imgLoaded) return
      await imageSave(
        canvasRef.current,
        maxView,
        imgUpdateQuery,
        imgUrl,
        row.id,
        'supplies'
      )
      setRow((row) => ({ ...row, img_url: imgUrl }))
    } catch (err) {
      handleError(err)
    }
  }

  const handleDeleteItem = async () => {
    if (row && row.id) {
      const answer = confirm(`Please confirm deletion of ${row.title}.`)
      if (!answer) return
      const res = await deleteItem({ type: 'supplies', id: row.id }).unwrap()
      if (canvasRef) imageClear(canvasRef, maxView)
      setResponse(res.data)
      setRow(emptyRow)
      setEditorOpened(false)
    }
  }

  const handleImgRemove = async () => {
    const answer = confirm(`Please confirm image remove`)
    if (!answer) return
    if (canvasRef) imageClear(canvasRef, maxView)
    if (row.img_url) {
      const res = await imgRemoveQuery({
        type: 'supplies',
        id: row.id,
      }).unwrap()
      setResponse(res.data)
      setRow((row) => ({ ...row, img_url: undefined }))
    }
    setImgLoaded(false)
  }

  useEffect(() => {
    setImgEditorProps((props) => ({
      ...props,
      id: row.id,
      url: row.img_url,
      imgLoaded,
    }))
  }, [imgLoaded, row.id, row.img_url])

  return (
    <div className="flex flex-col max-w-max relative">
      {errorMsg && (
        <h5 className="text-red-500 mb-2 whitespace-pre-line">{errorMsg}</h5>
      )}
      {!newItems.length && !isLoading && (
        <div className="flex text-lg justify-between items-center">
          <div className="mb-2 md:mb-1">
            <button
              onClick={() => handleEditItem(emptyRow)}
              type="button"
              className="px-2.5 pb-1 rounded-full active:scale-90 cursor-pointer hover:bg-slate-300  dark:hover:bg-slate-800 opacity-75 hover:opacity-100"
            >
              <i className="fas fa-plus mr-2" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="mb-2 md:mb-1">
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
      {newItems.length != 0 && !isLoading && (
        <SaveRemove setNew={setNewItems} handleSave={handleInsertItems} />
      )}
      {newItems.length != 0 && !isLoading && (
        <Chart headers={headers} rows={newItems} height="max-h-[700px]" />
      )}

      {/* Chart render in case of loading from database ------------------------------------------------------------------------*/}
      {supplies && !newItems.length && !isLoading && (
        <Chart<Item>
          headers={headers}
          rows={supplies}
          height="max-h-[185px]"
          mdheight="md:max-h-[570px]"
          handleEdit={handleEditItem}
        />
      )}

      {/* Item editor ------------------------------------------------------------------------------------------------------------------- */}
      {editorOpened && (
        <>
          <div className="flex flex-col md:pt-10 md:flex-row w-full border-slate-600 border-b text-lg py-2 justify-between relative">
            <div className="flex p-1 text-base absolute top-2">
              {response && (
                <h5
                  onAnimationEnd={() => setResponse('')}
                  className="text-teal-500 whitespace-pre-line result"
                >
                  {response}
                </h5>
              )}
            </div>
            {/* cancel button  (xmark) ------------------------------------------------------------------------------------------------- */}
            <button
              type="button"
              onClick={() => {
                setImgLoaded(false)
                setRow(emptyRow)
                setEditorOpened(false)
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
                  <label
                    htmlFor={key}
                    className="w-1/3 md:w-1/4 capitalize font-semibold"
                  >
                    {key + ':'}
                  </label>
                  <input
                    id={key}
                    type="text"
                    name={key}
                    onChange={onChange}
                    value={
                      key === 'price' && typeof row[key] === 'number'
                        ? row[key].toFixed(2)
                        : row[key as keyof Item]
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
                <label
                  htmlFor="description"
                  className="w-1/3 md:w-1/4 capitalize font-semibold"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  onChange={onChange}
                  value={row['description']}
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
              {row.id !== 0 && (
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
  )
}
