import { useEffect, useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import MemberList from "./MemberList"
import FormAction from "./FormAction"
import Alert from "./Alert"
import FormHeader from "./FormHeader"

export default function TeamManagement() {
  const [teamData, setTeamData] = useState(null)
  const { getTeamDataByReference, userInfos, userInfoLoading, deleteTeam } =
    useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")
  const [changeState, setChangeState] = useState({})
  const navigate = useNavigate()
  const descriptionRef = useRef()
  const nameRef = useRef()
  const joinPasswordRef = useRef()


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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const teamData = {
      teamName: nameRef.current.value,
      teamDescription: descriptionRef.current.value,
      joinPassword: joinPasswordRef.current.value
    }

    console.log("Updating team data", teamData)
    // Update team data
  }

  return (
    
    <div>
      
      <div className=" flex justify-end items-start ">
      <FormHeader heading="Panel zarządzania drużyną" />
      <button
          type="button"
          className=" bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-lg"
          onClick={() => handleDeleteTeam()}
        >
          Usuń drużynę
        </button>
      </div>

      <div className="mt-4">
        
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

          <form onSubmit={handleSubmit}>
          <label htmlFor="team-name" className="block mb-2 text-xs font-medium text-white">
            Nazwa drużyny
          </label>
          {teamData && (
            <input
              type="text"
              id="team-name"
              defaultValue={teamData.teamName || ""}
              onChange={handleChange}
              ref={nameRef}
              className={fixedInputClass}
            />
          )}


          <label htmlFor="team-description" className="block mb-2 text-xs font-medium text-white">
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
              ref={descriptionRef}
            ></textarea>
          )}

          <label htmlFor="team-join-password" className="block mb-2 text-xs font-medium text-white">
            Kod dołączenia
          </label>
          {teamData && <input
            type="text"
            id="team-join-password"
            className={fixedInputClass}
            defaultValue={teamData.joinPassword || ""}
            ref={joinPasswordRef}
            onChange={handleChange}

          />}

        <FormAction disabled={loading} text="Zapisz zmiany" />
        </form>
      </div>
    </div>
  )
}
