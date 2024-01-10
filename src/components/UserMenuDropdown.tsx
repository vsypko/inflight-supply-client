import { Dispatch, SetStateAction } from 'react'
import { useActions } from '../hooks/actions'
import { useLazyLogoutQuery } from '../store/auth/auth.api'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface UserDropownProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  close: Dispatch<SetStateAction<boolean>>
}

export default function DropdownMenu({
  open,
  setOpen,
  close,
}: UserDropownProps): JSX.Element {
  function selectionHandler() {
    setOpen(false)
    close(false)
  }
  const [logout, { error }] = useLazyLogoutQuery()
  const { signOut, removeCompanyFromState } = useActions()
  const { user } = useAuth()

  async function logOutHandler() {
    signOut()
    removeCompanyFromState()
    logout('')
    selectionHandler()
  }

  const itemStyle =
    'flex items-center my-4 px-3 cursor-pointer active:scale-90 rounded-full hover:bg-slate-300  dark:hover:bg-slate-700 opacity-75 hover:opacity-100 transition-all'

  return (
    <div
      onMouseLeave={() => setOpen(false)}
      className={`absolute top-9 bg-slate-200 dark:bg-slate-800 shadow shadow-slate-900 dark:shadow-slate-600 rounded-xl ${
        open ? 'flex' : 'hidden'
      }
      `}
    >
      <ul>
        <li onClick={selectionHandler}>
          <NavLink to={`/profile/${user.id}`} className={itemStyle}>
            <i className="fas fa-user-pen mr-2 p-2" />
            <span>PROFILE</span>
          </NavLink>
        </li>

        <li onClick={selectionHandler}>
          <NavLink to={`/account/${user.id}`} className={itemStyle}>
            <i className="fas fa-address-card p-2" />
            <span>ACCOUNT</span>
          </NavLink>
        </li>

        <li onClick={logOutHandler} className={itemStyle}>
          <i className="fas fa-right-from-bracket p-2" />
          <span>LOGOUT</span>
        </li>
      </ul>
    </div>
  )
}
