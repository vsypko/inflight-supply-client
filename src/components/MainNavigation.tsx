import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UserMenuDropdown from './UserMenuDropdown'

function toogleTheme(dark: boolean): void {
  if (!dark) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}

//Initial app theme ---------------------------------------------------------------------------
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  toogleTheme(true)
//---------------------------------------------------------------------------------------------

const mainMenu = [
  {
    title: 'AIRPORTS',
    to: '/',
    icon: 'fas fa-home group-[.isactive]:text-emerald-600 mr-2',
  },
  {
    title: 'AIRLINES',
    to: '/airlines',
    icon: 'fas fa-plane group-[.isactive]:text-sky-600 mr-2',
  },
  {
    title: 'PROVIDERS',
    to: '/catering',
    icon: 'fas fa-utensils group-[.isactive]:text-amber-600 mr-2',
  },
  {
    title: 'MESSAGES',
    to: '/messages',
    icon: 'fas fa-envelope-open-text group-[.isactive]:text-blue-700 mr-2',
  },
]

export default function MainNavigation() {
  const [navDropdownOpen, setNavDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [onHeader, setOnHeader] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const { user } = useAuth()

  function toogleThemeHandler(): void {
    setDarkMode((prev) => !prev)
    toogleTheme(!darkMode)
    setNavDropdownOpen(false)
  }

  const activeLink = 'flex md:border-b-2 border-slate-700 dark:border-slate-100 '
  const regularLink = 'flex opacity-75 hover:opacity-100'

  return (
    <header
      onMouseEnter={() => setOnHeader(true)}
      onMouseLeave={() => setOnHeader(false)}
      className="w-full sticky top-0 z-50 py-2 bg-slate-200 dark:bg-slate-900 shadow shadow-slate-900 dark:shadow-slate-600"
    >
      <nav className="flex w-full text-slate-700 dark:text-slate-100">
        <div className="w-full md:w-1/6 flex items-center text-lg">
          <NavLink
            onClick={() => setNavDropdownOpen(false)}
            className="w-1/2 flex justify-start pl-6 md:w-full text-xl font-bold hover:opacity-100 opacity-75"
            to="/"
          >
            <h1>InFLIGHT SUPPLY</h1>
          </NavLink>
          <button
            className="w-1/2 flex justify-end pr-6 cursor-pointer text-xl rounded-full md:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavDropdownOpen((prev) => !prev)}
          >
            <i className={`fas ${navDropdownOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>

        <div
          className={`md:w-5/6 md:flex md:justify-end ${
            navDropdownOpen
              ? 'absolute top-11 rounded-xl right-2 w-2/3 bg-slate-200 dark:bg-slate-800 p-5 text-lg shadow shadow-slate-600'
              : 'hidden'
          }`}
        >
          <div className="w-1/2 md:w-4/6 md:flex md:h-full">
            {mainMenu.map((item) => (
              <NavLink
                key={item.title}
                className={({ isActive }) =>
                  `h-full flex hover:opacity-100 mb-8 ml-4 text-xl md:text-lg md:mb-0 md:my-0 md:items-center md:mx-6 group ${
                    isActive
                      ? 'md:border-b-2 border-slate-700 dark:border-slate-100 opacity-100 isactive'
                      : 'opacity-75'
                  }`
                }
                to={item.to}
                onClick={() => setNavDropdownOpen(false)}
              >
                <i className={item.icon} />
                <div className="mx-2 relative">
                  <span>{item.title}</span>
                  {item.title === 'MESSAGES' && (
                    <span className="text-xs absolute -top-1 rounded-full bg-slate-300 dark:bg-slate-500">20</span>
                  )}
                </div>
              </NavLink>
            ))}

            {user.role && user.role !== 'user' && (
              <NavLink
                className={({ isActive }) =>
                  `h-full flex hover:opacity-100 my-8 ml-4 md:my-0 md:items-center md:mx-6 group ${
                    isActive
                      ? 'md:border-b-2 border-slate-700 dark:border-slate-100 opacity-100 isactive'
                      : 'opacity-75'
                  }`
                }
                to={`/admin/${user.role}`}
                onClick={() => setNavDropdownOpen(false)}
              >
                <i className="fas fa-screwdriver-wrench group-[.isactive]:text-gray-500 mr-2"></i>
                <span className="mx-2">ADMIN</span>
              </NavLink>
            )}

            <button
              title="Switch between light and dark mode"
              type="button"
              onClick={toogleThemeHandler}
              className="opacity-75 hover:opacity-100 flex items-center ml-4 md:mx-6 my-8 md:my-0"
            >
              <i className={`fas mr-2 ${darkMode ? 'fa-sun text-yellow-500' : 'fa-moon text-cyan-600 '}`}></i>
              <span className="mx-2">MODE</span>
            </button>
          </div>

          {/* user auth ------------------------------------------------------*/}

          <div className="w-full md:w-1/6 ml-4 flex items-center md:justify-end">
            {!user.id && (
              <NavLink
                className={({ isActive }) =>
                  `w-full flex items-center md:justify-end md:px-6 hover:opacity-100 group ${
                    isActive ? 'opacity-100 isactive' : 'opacity-75'
                  }`
                }
                to="/auth"
                onClick={() => setNavDropdownOpen(false)}
              >
                <i className="fas fa-user group-[.isactive]:text-orange-600"></i>
                <span className="mx-2 group-[.isactive]:text-orange-600 group-[.isactive]:font-bold">AUTH</span>
              </NavLink>
            )}

            {/* user avatar and menu ------------------------------------------------------*/}

            {user && user.id && (
              <div
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => {
                  if (onHeader) setUserDropdownOpen(false)
                }}
                className="w-full flex items-center md:justify-end md:px-6 relative -ml-2 md:-ml-0 h-full"
              >
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className={`flex items-center hover:opacity-100 ${userDropdownOpen ? 'opacity-100' : 'opacity-75'}`}
                >
                  {user.img_url && (
                    <img
                      className="w-9 h-9 rounded-full mr-3"
                      use-credentials="true"
                      alt=""
                      src={`${import.meta.env.VITE_API_URL}user/geturl/${user.img_url}`}
                    />
                  )}

                  {!user.img_url && <i className="fas fa-user-gear mr-3" />}

                  <i
                    className={`fas fa-chevron-down transition-all 
                        ${userDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>
                {userDropdownOpen && (
                  <UserMenuDropdown open={userDropdownOpen} setOpen={setUserDropdownOpen} close={setNavDropdownOpen} />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
