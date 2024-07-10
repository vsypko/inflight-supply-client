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
    'flex items-center text-xl md:text-lg my-6 px-4 cursor-pointer active:scale-90 rounded-full hover:bg-slate-300  dark:hover:bg-slate-700 opacity-75 hover:opacity-100 transition-all gap-4'

  return (
    <div
      onMouseLeave={() => setOpen(false)}
      className={`absolute top-10 bg-slate-200 dark:bg-slate-800 shadow shadow-slate-900 dark:shadow-slate-600 rounded-xl ${
        open ? 'flex' : 'hidden'
      }
      `}
    >
      <ul>
        <li onClick={selectionHandler}>
          <NavLink to={`/profile/${user.id}`} className={itemStyle}>
            <i className="fas fa-user-pen" />
            <span>PROFILE</span>
          </NavLink>
        </li>

        <li onClick={selectionHandler}>
          <NavLink to={`/account/${user.id}`} className={itemStyle}>
            <i className="fas fa-address-card" />
            <span>ACCOUNT</span>
          </NavLink>
        </li>

        <li onClick={logOutHandler} className={itemStyle}>
          <i className="fas fa-right-from-bracket" />
          <span>LOGOUT</span>
        </li>
      </ul>
    </div>
  )
}
