import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import AppRouter from "./components/AppRouter"
import { Provider } from "react-redux"
import { store } from "./store/store"

import "./index.css"
import "mapbox-gl/dist/mapbox-gl.css"

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
)
  document.documentElement.classList.add("dark")
else document.documentElement.classList.remove("dark")

const body = document.getElementsByTagName("body")[0]
body.setAttribute("class", "bg-slate-200 dark:bg-slate-900")
const main = document.getElementById("root")

const root = createRoot(main as HTMLElement)
root.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
)
