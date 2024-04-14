import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function PrivateRoute({ children, allowedRoles, navigateTo }) {
  const { currentUser, userInfos, userInfoLoading } = useAuth()

  if (!currentUser) {
    return <Navigate to={"/login"} />
  }

  // if (!userInfos) {
  //   return <Spinner />
  // }
  if (userInfoLoading || !userInfos) {
    return <Spinner />
  }

  const hasAllowedRole = currentUser && allowedRoles?.includes(userInfos.role)

  return (allowedRoles ? hasAllowedRole : currentUser) ? (
    children
  ) : (
    <Navigate to={navigateTo ? navigateTo : "/login"} />
  )
}
