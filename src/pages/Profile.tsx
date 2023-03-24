import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import { useActions } from "../hooks/actions"
import ImageEditor from "../components/ImageEditor"

export default function Profile() {
  const { user, company, country } = useAuth()
  const [photoEdit, setPhotoEdit] = useState(false)

  const [firstnameIsEntering, setFirstnameIsEntering] = useState(false)
  const [lastnameIsEntering, setLastnameIsEntering] = useState(false)
  const [value, setValue] = useState({
    firstname: user?.usr_firstname,
    lastname: user?.usr_lastname,
  })

  const { updateAuth } = useActions()

  function handleSave() {
    setFirstnameIsEntering(false)
    setLastnameIsEntering(false)
    updateAuth(value)
  }

  return (
    <div className="flex flex-col items-center text-lg">
      <h1 className="w-full py-4 text-center text-3xl font-bold">PROFILE</h1>
      <div className="w-full md:w-1/2 px-4 md:px-0">
        <div className="flex p-2 h-[218px] border border-spacing-1 rounded-xl border-slate-600 dark:border-slate-100 justify-center relative">
          {!photoEdit ? (
            <>
              <img
                width="200px"
                height="200px"
                alt=""
                src={import.meta.env.VITE_USER_URL + user!.usr_url}
                className="absolute"
              />
              <button
                onClick={() => setPhotoEdit(true)}
                className="absolute bottom-2 right-2 rounded-full px-2 text-lg active:text-base active:bottom-3 active:right-5 hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70 hover:opacity-100"
              >
                <i className="fas fa-pencil mr-2" />
                <span>Edit</span>
              </button>
            </>
          ) : (
            <ImageEditor setPhotoEdit={setPhotoEdit} />
          )}
        </div>
        <form onSubmit={handleSave}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 mt-6 w-full group">
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
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
                name="last_name"
                id="last_name"
                className="block mt-6 w-full text-slate-800 dark:text-slate-100 bg-transparent appearance-none border-0 border-b-2 border-slate-400 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-400 focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
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
            <div className="block mt-4 items-center border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <div className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-mobile-screen-button mr-2"></i>
                <span>Phone</span>
              </div>
              {country?.cn_phonecode && (
                <div className="flex">
                  <img src={`data:image/png;base64, ${country?.cn_flag}`} alt="" className="py-1" />
                  <span className="text-slate-800 dark:text-slate-200 ml-2">+{country?.cn_phonecode}</span>
                </div>
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
                  <img src={`data:image/png;base64, ${company?.co_country_flag}`} alt="" className="py-1" />
                  <span className="text-slate-800 dark:text-slate-200 ml-2">{company?.co_country_name}</span>
                </div>
              </div>
            </div>
            <div className="block mt-4 border-0 border-b-2 border-slate-400 dark:border-slate-600">
              <div className="w-full scale-90 text-slate-600 dark:text-slate-400 origin-[0]">
                <i className="fas fa-user-shield mr-2"></i>
                <span>Role</span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 flex justify-center items-center">
                {user?.usr_role_name}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
