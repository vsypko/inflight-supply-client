import { Dispatch, SetStateAction } from "react"
import { useActions } from "../hooks/actions"
import { useLazyLogoutQuery } from "../store/auth/auth.api"
import { NavLink } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface UserDropownProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  close: Dispatch<SetStateAction<boolean>>
}

export default function DropdownMenu({ open, setOpen, close }: UserDropownProps): JSX.Element {
  function selectionHandler() {
    setOpen(false)
    close(false)
  }
  const [logout] = useLazyLogoutQuery()
  const { logOut } = useActions()
  const { user } = useAuth()

  const itemStyle =
    "flex items-center my-2 lg:my-1 lg:px-3 dark:text-slate-400 text-slate-600 rounded-full hover:bg-slate-700 hover:text-slate-300 dark:hover:text-slate-200 cursor-pointer transition-colors"

  return (
    <div
      onMouseLeave={() => setOpen(false)}
      className={
        "absolute top-16 px-2 lg:p-2 lg:mt-0 lg:top-9 lg:-right-4 bg-slate-200 dark:bg-slate-900 shadow shadow-slate-400 dark:shadow-slate-600 rounded-md" +
        (open ? " flex" : " hidden")
      }
    >
      <ul>
        <li onClick={selectionHandler} className={itemStyle}>
          <NavLink to={`/profile/${user!.usr_role_name}`}>
            <i className="fas fa-user-pen mr-4" />
            PROFILE
          </NavLink>
        </li>
        <li onClick={selectionHandler} className={itemStyle}>
          <i className="fas fa-address-card mr-4" />
          ACCOUNT
        </li>
        <li
          onClick={async () => {
            logOut()
            await logout("")
            setOpen(false)
          }}
          className={itemStyle}
        >
          <i className="fas fa-right-from-bracket mr-4" />
          LOGOUT
        </li>
      </ul>
    </div>
  )
}
