import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import DropdownMenu from "./DropdownMenu"

function toogleTheme(dark: boolean): void {
  if (!dark) {
    document.documentElement.classList.remove("dark")
  } else {
    document.documentElement.classList.add("dark")
  }
}

//Initial app theme ---------------------------------------------------------------------------
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
)
  toogleTheme(true)
//---------------------------------------------------------------------------------------------

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

  const activeLink = "lg:mr-10 flex uppercase mt-5 lg:mt-3 pb-1 lg:border-b-2 "
  const regularLink = "lg:mr-10 flex uppercase mt-5 lg:mt-3 pb-1 opacity-60 hover:opacity-100"

  return (
    <header
      onMouseEnter={() => setOnHeader(true)}
      onMouseLeave={() => setOnHeader(false)}
      className="w-full sticky top-0 z-50 rounded-full bg-slate-200 dark:bg-slate-900 shadow shadow-slate-900 dark:shadow-slate-600"
    >
      <nav>
        <div className="px-10 flex flex-wrap items-center justify-between text-slate-700 dark:text-slate-100 text:base lg:text-sm">
          <div className="w-full pt-1 flex items-center justify-between lg:w-auto text-lg">
            <NavLink
              onClick={() => setNavDropdownOpen(false)}
              className="text-md capitalize font-bold hover:opacity-75"
              to="/"
            >
              InFLIGHT SUPPLY
            </NavLink>
            <button
              className="cursor-pointer text-xl border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavDropdownOpen((prev) => !prev)}
            >
              <i className={`fas ${navDropdownOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
          <div
            className={`lg:flex ${
              navDropdownOpen
                ? "absolute top-10 rounded-md right-1 w-1/2 bg-slate-200 dark:bg-slate-800 pl-6 shadow shadow-slate-600 dark:shadow-slate-600"
                : "hidden"
            }`}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-32 list-none">
              <div className="flex flex-col lg:flex-row">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? activeLink : regularLink)}
                    to="/"
                    onClick={() => setNavDropdownOpen(false)}
                  >
                    <i className="fas fa-home"></i>
                    <span className="ml-2">AIRPORTS</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? activeLink : regularLink)}
                    to="/airlines"
                    onClick={() => setNavDropdownOpen(false)}
                  >
                    <i className="fas fa-plane"></i>
                    <span className="ml-2">AIRLINES</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? activeLink : regularLink)}
                    to="/catering"
                    onClick={() => setNavDropdownOpen(false)}
                  >
                    <i className="fas fa-utensils"></i>
                    <span className="ml-2">PROVIDERS</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? activeLink : regularLink)}
                    to="/messages"
                    onClick={() => setNavDropdownOpen(false)}
                  >
                    <i className="fas fa-envelope-open-text"></i>
                    <span className="ml-2">
                      MESSAGES
                      <span className="text-xs relative bottom-2 rounded-full bg-slate-500">20</span>
                    </span>
                  </NavLink>
                </li>
                {user != null && user.role_name != "admin" && (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => (isActive ? activeLink : regularLink)}
                      to={`/admin/${user.role_name}`}
                      onClick={() => setNavDropdownOpen(false)}
                    >
                      <i className="fas fa-screwdriver-wrench"></i>
                      <span className="ml-2">ADMIN</span>
                    </NavLink>
                  </li>
                )}
                <button
                  title="Switch between light and dark mode"
                  type="button"
                  onClick={toogleThemeHandler}
                  className="pt-5 lg:pt-1 flex items-center text-lg lg:text-sm border-transparent bg-transparent opacity-50 hover:opacity-100"
                >
                  <i className={"fas " + (darkMode ? "fa-sun" : "fa-moon")}></i>
                  <span className="ml-2 pt-1">MODE</span>
                </button>
              </div>
              <div className="flex flex-col lg:flex-row">
                {!user && (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => (isActive ? activeLink : regularLink)}
                      to="/auth"
                      onClick={() => setNavDropdownOpen(false)}
                    >
                      <i className="fas fa-user"></i>
                      <span className="ml-2">AUTH</span>
                    </NavLink>
                  </li>
                )}
                {user && (
                  <div
                    onMouseEnter={() => setUserDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (onHeader) setUserDropdownOpen(false)
                    }}
                    className="pt-5 pb-2 lg:pb-0 lg:pt-1 flex items-center text-lg lg:text-base border-transparent bg-transparent relative"
                  >
                    <button
                      onClick={() => setUserDropdownOpen((prev) => !prev)}
                      className={`opacity-50 hover:opacity-100 ${userDropdownOpen ? "opacity-100" : "opacity-50"}`}
                    >
                      <i className="fa-solid fa-user-gear mr-3"></i>
                      <i
                        className={`fa-solid fa-chevron-down transition-all 
                        ${userDropdownOpen ? "rotate-180" : "rotate-0"}`}
                      ></i>
                    </button>
                    <DropdownMenu open={userDropdownOpen} setOpen={setUserDropdownOpen} close={setNavDropdownOpen} />
                  </div>
                )}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
