import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function DashboardPage() {
  const [error, setError] = useState("")
  const [userInfo, setUserInfo] = useState(null) // add a new state variable for user info
  const { currentUser, logout, getUserInfo } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getUserInfo(currentUser.uid).then((info) => setUserInfo(info))
    }
  }, [currentUser, getUserInfo])

  function handleLogout(e) {
    e.preventDefault()

    setError("")
    logout()
      .then(() => {
        navigate("/login")
        console.log("Logged out")
      })
      .catch((e) => {
        setError("Failed to log out")
        console.log("Could not log out")
        console.error("An error occurred while logging out", e)
      })
  }
  console.log(currentUser)
  getUserInfo(currentUser.uid)
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center h-screen">
        {error && (
          <Alert message={error} type="error">
            {error}
          </Alert>
        )}
        <h1 className="text-3xl font-bold mb-4">Panel użytkownika</h1>
        {userInfo ? (
          <h2 className="text-xl mb-4">Witaj, {userInfo.firstName}!</h2>
        ) : null}
        <button
          className="bg-fourth hover:bg-third text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </>
  )
}
