import { useAuth } from "../hooks/useAuth"
import { ChangeEvent, FormEvent, useState } from "react"
import { useActions } from "../hooks/actions"
import ImgEditor from "../components/ImgEditor"
import {
  useUserProfileUpdateMutation,
  useUserUrlRemoveMutation,
  useUserUrlUpdateMutation,
} from "../store/auth/auth.api"
import DropdownCountries from "../components/DropdownCountries"
import { IUserUpdateRequest } from "../types/user.types"

export default function Profile() {
  const { user, company, country } = useAuth()
  const { updateUserUrl, updateUserData } = useActions()
  const [userUrlUpdateQuery] = useUserUrlUpdateMutation()
  const [userUrlRemoveQuery] = useUserUrlRemoveMutation()
  const [userProfileUpdateQuery] = useUserProfileUpdateMutation()

  const [photoEdit, setPhotoEdit] = useState(false)
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false)

  const imgEditorProps = {
    path: "user/geturl/",
    url: user?.usr_url,
    id: user?.id,
    setImageEdit: setPhotoEdit,
    imgUpdateQuery: userUrlUpdateQuery,
    imgRemoveQuery: userUrlRemoveQuery,
    imgUrlUpdateAction: updateUserUrl,
  }

  const [value, setValue] = useState<IUserUpdateRequest>({
    id: user!.id,
    firstname: user!.usr_firstname || "",
    lastname: user!.usr_lastname || "",
    phone: user!.usr_phone || "",
    cn: user!.usr_cn === "ZZ" ? country!.cn_iso : user!.usr_cn || "ZZ",
  })

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((value) => ({ ...value, [event.target.name]: event.target.value }))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    const profile = await userProfileUpdateQuery(value).unwrap()
    updateUserData(profile)
  }

  return (
    <div className="flex flex-col items-center text-lg">
      <h1 className="w-full py-4 text-center text-3xl font-bold">PROFILE</h1>
      <div className="w-full md:w-1/2 px-4 md:px-0">
        <div className="flex p-2 h-[218px] border border-spacing-1 rounded-xl border-slate-600 dark:border-slate-100 justify-center items-center relative">
          {user?.usr_url && !photoEdit ? (
            <>
              <img
                width="200px"
                height="200px"
                use-credentials="true"
                alt=""
                src={import.meta.env.VITE_API_URL + "user/geturl/" + user.usr_url}
                className="absolute"
              />

              <button
                onClick={() => setPhotoEdit(true)}
                className="absolute bottom-1 right-1 px-2 py-1 text-lg lg:text-xl lg:px-3 lg:right-6 rounded-full  active:scale-90 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
              >
                <i className="fas fa-pencil mr-2" />
                <span>Edit</span>
              </button>
            </>
          ) : (
            <ImgEditor imgEditorProps={imgEditorProps} />
          )}
        </div>
        <form onSubmit={handleSave}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 mt-6 w-full group">
              <input
                autoFocus
                type="text"
                name="firstname"
                value={value.firstname}
                id="first_name"
                onChange={onChange}
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
              />
              <label
                htmlFor="first_name"
                className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-12"
              >
                <i className="far fa-user mr-2" />
                First Name
              </label>
            </div>
            <div className="relative z-0 mt-6 w-full group">
              <input
                type="text"
                name="lastname"
                value={value.lastname}
                id="last_name"
                onChange={onChange}
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
              />
              <label
                htmlFor="last_name"
                className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-90 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-12"
              >
                <i className="fas fa-user mr-2" />
                Last Name
              </label>
            </div>
            <div className="block mt-4 border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <div className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="far fa-envelope mr-2" />
                <span>Email</span>
              </div>
              <span className="text-slate-800 dark:text-slate-200">{user?.usr_email}</span>
            </div>

            {/*-Phone Input--------------------------------------------------------------------------------*/}

            <div className="relative mt-6 w-full group">
              <input
                type="text"
                name="phone"
                id="phone"
                value={value.phone}
                onChange={onChange}
                className="block mt-6 pl-28 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder="000000000"
              />
              <label
                htmlFor="phone"
                className="absolute text-slate-600 dark:text-slate-400 duration-300 transform -translate-y-9 scale-100 top-8 origin-[0] peer-focus:left-0 peer-focus:text-slate-500 dark:peer-focus:text-slate-400 peer-focus:scale-75 peer-focus:-translate-y-12"
              >
                <i className="fas fa-mobile-screen-button mr-2"></i>
                <span>Phone</span>
              </label>
              <button
                type="button"
                className="absolute top-6 flex items-center text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:group-hover:text-slate-200 dark:peer-focus:text-slate-200"
                onClick={() => setOpenCountryDropdown((prev) => !prev)}
              >
                <img src={`data:image/png;base64, ${country?.cn_flag}`} alt="" className="py-1 mr-1" />
                <span className="mr-1">+{country!.cn_phonecode}</span>
                <i
                  className={`fa-solid fa-chevron-down transition-all ${
                    openCountryDropdown ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openCountryDropdown && (
                <DropdownCountries value={value} setValue={setValue} setOpen={setOpenCountryDropdown} />
              )}
            </div>

            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <div className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-building-user mr-2" />
                <span>Company</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-800 dark:text-slate-200">{company?.co_name}</span>
                <div className="flex justify-end items-center">
                  <img src={`data:image/png;base64, ${company?.co_cn_flag}`} alt="" className="py-1" />
                  <span className="text-slate-800 dark:text-slate-200 ml-2">{company?.co_cn_name}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-4 border-0 border-b-2 border-slate-400 dark:border-slate-600 justify-between">
              <div className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-user-shield mr-2"></i>
                <span>Role</span>
              </div>

              <span className="text-slate-800 dark:text-slate-200">{user?.usr_role_name}</span>
            </div>
          </div>

          {/* submit button----------------------------------------- */}

          <div className="w-full flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-1 text-xl flex justify-between items-center rounded-full active:scale-90 bg-teal-400 hover:bg-teal-500 dark:bg-teal-900 dark:hover:bg-teal-800"
            >
              <i className="fas fa-download mr-12" />
              <span>SAVE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
