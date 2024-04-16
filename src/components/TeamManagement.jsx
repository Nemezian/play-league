import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"

export default function TeamManagement() {
  const [teamData, setTeamData] = useState(null)
  const { getTeamDataByReference, userInfos, userInfoLoading, deleteTeam } =
    useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
        {/* <div className="flex items-center space-x-2">
          <label htmlFor="team-name" className="text-white">
            Nazwa drużyny
          </label>
          <input
            type="text"
            id="team-name"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="team-description" className="text-white">
            Opis drużyny
          </label>
          <textarea
            id="team-description"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="team-members" className="text-white">
            Członkowie drużyny
          </label>
          <input
            type="text"
            id="team-members"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
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
        <button className="mt-4 bg-blue-500 text-white py-2 rounded-lg">
          Zapisz zmiany
        </button> */}
      </div>
    </div>
  )
}
