import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PasswordChange } from "../components"
import ReactModal from "react-modal"

ReactModal.setAppElement("#root")

export default function DashboardPage() {
  const [error, setError] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const { currentUser, logout, getUserInfo } = useAuth()
  const [modalIsOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getUserInfo(currentUser.uid).then((info) => setUserInfo(info))
    }
  }, [currentUser, getUserInfo])

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  // function handleLogout(e) {
  //   e.preventDefault()

  //   setError("")
  //   logout()
  //     .then(() => {
  //       navigate("/login")
  //       console.log("Logged out")
  //     })
  //     .catch((e) => {
  //       setError("Niepomyślna próba wylogowania")
  //       console.log("Could not log out")
  //       console.error("An error occurred while logging out", e)
  //     })
  // }
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
          <h2 className="text-xl mb-4">
            Witaj, {userInfo.firstName + " " + userInfo.lastName}!
          </h2>
        ) : null}
        <div className="flex flex-row justify-between w-full ">
          <div className="">
            <h2 className="text-xl font-bold mb-4">Twoje dane:</h2>
            <div className="flex flex-col items-start justify-start">
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              {userInfo ? (
                <>
                  <p>
                    <strong>Imię:</strong> {userInfo.firstName}
                  </p>
                  <p>
                    <strong>Nazwisko:</strong> {userInfo.lastName}
                  </p>
                  <p>
                    <strong>Drużyna:</strong> {userInfo.teamName || "Brak"}
                  </p>
                  {/* <p>
                  <strong>Telefon:</strong> {userInfo.phone}
                </p> */}
                </>
              ) : null}
            </div>
            <button
              className="bg-fourth hover:bg-third text-white mt-3 py-1 px-2 rounded"
              onClick={openModal}
            >
              Zmień hasło
            </button>
          </div>
          <div>
            {/* <button
            className="bg-fourth hover:bg-third text-white py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Log Out
          </button> */}

            <ReactModal
              isOpen={modalIsOpen}
              //onRequestClose={closeModal}
              // onRequestClose={handlePasswordChange}
              className=" overflow-y-auto overflow-x-hidden bg-secondary rounded-lg p-4"
              // overlayClassName="overlay"
            >
              <button
                className="bg-fourth  hover:bg-third text-white justify-end mt-3 py-1 px-2 rounded"
                onClick={closeModal}
              >
                X
              </button>
              <PasswordChange />
            </ReactModal>
          </div>
        </div>
      </div>
    </>
  )
}
