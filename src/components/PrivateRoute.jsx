import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ children, allowedRoles, navigateTo }) {
  const { currentUser, getUserInfo } = useAuth()
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    if (!currentUser) return
    getUserInfo(currentUser.uid).then((userInfo) => {
      setUserRole(userInfo.role)
    })
  }, [currentUser])

  const hasAllowedRole = currentUser && allowedRoles?.includes(userRole)

  return (allowedRoles ? hasAllowedRole : currentUser) ? (
    children
  ) : (
    <Navigate to={navigateTo ? navigateTo : "/login"} />
  )
}
