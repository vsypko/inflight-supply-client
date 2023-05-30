import { useEffect, useState } from "react"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useGetUsersQuery } from "../store/users/users.api"
import { IUser } from "../types/user.types"

export default function Messages() {
  const [users, setUsers] = useState<IUser[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const { data, error, isError, isSuccess, isLoading } = useGetUsersQuery("", { refetchOnMountOrArgChange: true })

  useEffect(() => {
    setErrorMsg("")
    if (error) {
      if (error != null && typeof error === "object" && "data" in error) setErrorMsg(error.data as string)
      if (error != null && typeof error === "object" && "error" in error) setErrorMsg(error.error as string)
    }
  }, [error])

  return (
    <div>
      <h2>Mesagges Page</h2>
      <h3>All Users List</h3>
      {isSuccess && (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              <p>id: {user.id}</p>
              <p>email: {user.email}</p>
              <p>role: {user.role}</p>
            </li>
          ))}
        </ul>
      )}
      {isError && <div className="text-red-500">{errorMsg}</div>}
      {isLoading && (
        <div className="mt-28">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
