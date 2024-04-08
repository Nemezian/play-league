import { useAuth } from "../contexts/AuthContext"
import ReactModal from "react-modal"
import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import Alert from "./Alert"
import Input from "./Input"
import FormAction from "./FormAction"

export default function ListTeams({ teams }) {
  const { joinTeam } = useAuth()
  const [joinPassword, setJoinPassword] = useState("")
  const [error, setError] = useState("")
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loading, setLoading] = useState(false)

  const openModal = (team) => {
    setSelectedTeam(team)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedTeam(null)
    setJoinPassword("")
    setError("")
  }

  const handleJoinClick = (team) => {
    setSelectedTeam(team)
    openModal(team)
  }

  const handleJoin = (e) => {
    e.preventDefault()

    setError("")

    console.log("Joining team", selectedTeam, joinPassword)
    if (selectedTeam) {
      joinTeam(selectedTeam, joinPassword)
        .then(() => {
          closeModal()
        })
        .catch((e) => {
          console.error("An error occurred while joining team", e)
          setError("Nie udało się dołączyć do drużyny")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Lista drużyn</h1>
      <ul className="mt-4">
        {teams.map((team) => (
          <li
            key={team.id}
            className="flex justify-between items-center p-2 bg-gray-800 text-white rounded-lg mb-2"
          >
            <div>
              <h2 className="text-lg font-bold">{team.teamName}</h2>
            </div>
            <button
              className="bg-fourth hover:bg-third text-white px-4 py-2 rounded-lg"
              onClick={() => handleJoinClick(team)}
            >
              Dołącz
            </button>
          </li>
        ))}
      </ul>
      <div>
        <ReactModal
          isOpen={modalIsOpen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={closeModal}
          className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-auto z-50"
        >
          <div className="flex justify-end z-40">
            <button className="block" onClick={closeModal}>
              <AiOutlineClose size={20} />
            </button>
          </div>
          <form
            className="flex flex-col items-center justify-center top-1/2 left-1/2 z-50"
            onSubmit={(e) => handleJoin(e)}
          >
            {error && <Alert type="error" message={error} />}
            <Input
              id="join-password"
              name="join-password"
              labelText="Kod dołączenia"
              labelFor="join-password"
              type="password"
              value={joinPassword}
              handleChange={(e) => setJoinPassword(e.target.value)}
              isRequired={true}
              autoComplete={"password"}
            />

            <FormAction disabled={loading} text="Dołącz" />
          </form>
        </ReactModal>
      </div>
    </div>
  )
}
