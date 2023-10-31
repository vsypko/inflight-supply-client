import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom"
import RootLayout from "../pages/RootLayout"
import MainPage from "../pages/MainPage"
import Airlines from "../pages/Airlines"
import Catering from "../pages/Catering"
import Messages from "../pages/Messages"
import Auth from "../pages/Auth"

import Admin from "../pages/Admin"
import Profile from "../pages/Profile"
import Account from "../pages/Account"
import { useAuth } from "../hooks/useAuth"
import { User } from "../types/user.types"

const TSXRouter = (user: User) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<MainPage />} />
        <Route path="/airlines" element={<Airlines />} />
        <Route path="/catering" element={<Catering />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin/:id" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile/:id" element={user.id ? <Profile /> : <Navigate replace to="/auth" />} />
        <Route path="/account/:id" element={user.id ? <Account /> : <Navigate replace to="/auth" />} />
      </Route>,
    ),
  )
}

export default function AppRouter() {
  const { user } = useAuth()
  return <RouterProvider router={TSXRouter(user)} />
}
