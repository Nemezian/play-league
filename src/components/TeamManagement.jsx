import { useEffect, useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import MemberList from "./MemberList"
import FormAction from "./FormAction"
import Alert from "./Alert"

export default function TeamManagement() {
  const [teamData, setTeamData] = useState(null)
  const { getTeamDataByReference, userInfos, userInfoLoading, deleteTeam } =
    useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")
  const [changeState, setChangeState] = useState({})
  const navigate = useNavigate()

  const fixedInputClass =
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  if (userInfoLoading) {
    return <Spinner />
  }

  useEffect(() => {
    if (!userInfoLoading) {
      getTeamDataByReference(userInfos.teamId)
        .then((data) => {
          setTeamData(data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }, [userInfos, userInfoLoading])

  const handleDeleteTeam = () => {
    setError("")

    console.log("Deleting team", userInfos.teamId)
    deleteTeam(userInfos.teamId)
      .then(() =>
        navigate("/", { state: { message: "Drużyna została usunięta" } })
      )
      .catch(() => setError("Błąd podczas usuwania drużyny"))
  }

  const handleChange = (e) => {
    setChangeState({ ...changeState, [e.target.id]: e.target.value })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Zarządzaj drużyną</h1>
      <div className="mt-4">
        <button
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-lg"
          onClick={() => handleDeleteTeam()}
        >
          Usuń drużynę
        </button>
        <div className="bg-gray-500/[.2] p-6 rounded-lg shadow-md">
          <h1 className="font-bold text-lg pb-2">Lista zawodników:</h1>
          {teamData && teamData.players.length > 0 ? (
            <MemberList members={teamData.players} />
          ) : (
            <p className="text-red-700 text-base text-center">
              Brak zawodników w drużynie
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="team-name" className="text-white">
            Nazwa drużyny
          </label>
          {teamData && (
            <input
              type="text"
              id="team-name"
              defaultValue={teamData.teamName || ""}
              className="p-2 bg-gray-500/[.8] rounded-lg"
            />
          )}
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="team-description" className="text-white">
            Opis drużyny
          </label>
          {teamData && (
            <textarea
              id="team-description"
              name="team-description"
              type="longText"
              placeholder="Opis drużyny"
              defaultValue={teamData.teamDescription || ""}
              className={fixedInputClass + " resize-none"}
              onChange={handleChange}
              rows={5}
              cols={30}
            ></textarea>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="team-join-code" className="text-white">
            Kod dołączenia
          </label>
          <input
            type="text"
            id="team-join-code"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <FormAction disabled={loading} text="Zapisz zmiany" />
      </div>
    </div>
  )
}
