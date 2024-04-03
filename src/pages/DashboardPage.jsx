import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PasswordChange, Alert } from "../components"
import ReactModal from "react-modal"
import { AiOutlineClose } from "react-icons/ai"

ReactModal.setAppElement("#root")

export default function DashboardPage() {
  const [message, setMessage] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const { currentUser, getUserInfo } = useAuth()
  const [modalIsOpen, setIsOpen] = useState(false)

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

  const getFormResult = (result) => {
    if (result === "success") {
      closeModal()
    }
  }

  const getFormMessage = (message) => {
    setMessage(message)
  }

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center h-[640px]">
        <h1 className="text-3xl font-bold mb-4">Panel użytkownika</h1>
        {userInfo ? (
          <h2 className="text-xl mb-4">
            Witaj, {userInfo.firstName + " " + userInfo.lastName}!
          </h2>
        ) : null}
        {message && (
          <Alert message={message} type="success">
            {message}
          </Alert>
        )}
        <div className="flex flex-row justify-between w-full ">
          <div>
            <h2 className="text-xl font-bold mb-4">Twoje dane:</h2>
            <div className="flex flex-col items-start justify-start text-lg">
              <p className="py-1.5">
                <strong>Email:</strong>
                <br /> {currentUser.email}
              </p>
              {userInfo ? (
                <>
                  <p className="py-1.5">
                    <strong>Imię:</strong> <br />
                    {userInfo.firstName}
                  </p>
                  <p className="py-1.5">
                    <strong>Nazwisko:</strong> <br />
                    {userInfo.lastName}
                  </p>
                  <p className="py-1.5">
                    <strong>Drużyna:</strong>
                    <br /> {userInfo.teamName || "Brak"}
                  </p>
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
            <ReactModal
              isOpen={modalIsOpen}
              shouldCloseOnOverlayClick={true}
              onRequestClose={closeModal}
              className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-auto z-50"
            >
              <div className="flex justify-end">
                <button className="block" onClick={closeModal}>
                  <AiOutlineClose size={20} />
                </button>
              </div>
              <PasswordChange
                onFormSubmit={getFormResult}
                submitMessage={getFormMessage}
              />
            </ReactModal>
          </div>
        </div>
      </div>
    </>
  )
}
