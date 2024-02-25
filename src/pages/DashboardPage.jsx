import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PasswordChange } from "../components"

export default function DashboardPage() {
  const [error, setError] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const { currentUser, logout, getUserInfo } = useAuth()
  const [passwordChangeContainer, setPasswordChangeContainer] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getUserInfo(currentUser.uid).then((info) => setUserInfo(info))
    }
  }, [currentUser, getUserInfo])

  const handlePasswordChange = () => {
    setPasswordChangeContainer(!passwordChangeContainer)
  }

  function handleLogout(e) {
    e.preventDefault()

    setError("")
    logout()
      .then(() => {
        navigate("/login")
        console.log("Logged out")
      })
      .catch((e) => {
        setError("Niepomyślna próba wylogowania")
        console.log("Could not log out")
        console.error("An error occurred while logging out", e)
      })
  }
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center h-[640px]">
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
          className="bg-fourth hover:bg-third text-white py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className="bg-fourth hover:bg-third text-white mt-3 py-2 px-4 rounded"
          onClick={handlePasswordChange}
        >
          Zmień hasło
        </button>
        {passwordChangeContainer && <PasswordChange />}
      </div>
    </>
  )
}
