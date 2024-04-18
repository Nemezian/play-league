import { useEffect, useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import MemberListToDelete from "./MemberListToDelete"
import FormAction from "./FormAction"
import Alert from "./Alert"
import FormHeader from "./FormHeader"
import { AiOutlineEdit } from "react-icons/ai"

export default function TeamManagement() {
  const [teamData, setTeamData] = useState(null)
  const {
    getTeamDataByReference,
    userInfos,
    userInfoLoading,
    deleteTeam,
    updateTeamInfo,
  } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")
  const [changeState, setChangeState] = useState({})
  const navigate = useNavigate()
  const descriptionRef = useRef()
  const nameRef = useRef()
  const joinPasswordRef = useRef()
  const [preferredMatchDays, setPreferredMatchDays] = useState([])
  const [renderedComponent, setRenderedComponent] = useState("info")

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

    const queryTeamData = {
      teamName: nameRef.current.value.trim(),
      teamDescription: descriptionRef.current.value.trim(),
      joinPassword: joinPasswordRef.current.value.trim(),
    }

    if (queryTeamData.teamName === "") {
      setError("Nazwa drużyny nie może być pusta")
      setLoading(false)
      return
    }

    if (queryTeamData.joinPassword === "") {
      setError("Kod dołączenia nie może być pusty")
      setLoading(false)
      return
    }

    // updateTeamInfo(userInfos.teamId, queryTeamData)
    //   .then(() => {
    //     setMessage("Zaktualizowano dane drużyny")
    //   })
    //   .catch(() => setError("Błąd podczas aktualizacji danych drużyny"))
    //   .finally(() => setLoading(false))

    console.log("Updating team data", queryTeamData)
    // Update team data
  }

  const handleComponentChange = (component) => {
    setRenderedComponent(component)
  }

  return (
    <div>
      <div className=" flex justify-end items-start ">
        <FormHeader heading="Panel zarządzania drużyną" />
      </div>

      {message && <Alert message={message} type="success" />}
      {error && <Alert message={error} type="error" />}
      <div className="flex flex-row justify-between  items-start h-[20rem]">
        <nav className="flex flex-col justify-center items-center pr-2 mr-2 border-gray-500 border-r-2 w-3/12 h-full">
          <button
            className="block rounded py-2 px-2 hover:bg-third bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("info")}
          >
            Edytuj informacje
          </button>
          <button
            className="block rounded py-2 px-2 hover:bg-third bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("members")}
          >
            Członkowie
          </button>
        </nav>
        {renderedComponent === "members" && (
          <div className="flex flex-col justify-center items-end w-full">
            <button
              type="button"
              className="w-[8rem] bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-lg"
              onClick={() => handleDeleteTeam()}
            >
              Usuń drużynę
            </button>
            <div className="bg-gray-500/[.2] p-6 rounded-lg shadow-md w-full">
              <h1 className="font-bold text-lg pb-2">Lista zawodników:</h1>
              {teamData && teamData.players.length > 0 ? (
                <MemberListToDelete
                  members={teamData.players}
                  itemsClassName="flex justify-between items-center mb-2"
                />
              ) : (
                <p className="text-red-700 text-base text-center ">
                  Brak zawodników w drużynie
                </p>
              )}
            </div>
          </div>
        )}
        {renderedComponent === "info" && (
          <form onSubmit={handleSubmit} className="w-full">
            {/* <AiOutlineEdit className="text-4xl text-fourth mb-4" /> */}
            <label
              htmlFor="team-name"
              className="block mb-1 text-xs font-medium text-white"
            >
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
            <label
              htmlFor="team-join-password"
              className="block mb-1 text-xs font-medium text-white"
            >
              Kod dołączenia
            </label>
            {teamData && (
              <input
                type="text"
                id="team-join-password"
                className={fixedInputClass}
                defaultValue={teamData.joinPassword || ""}
                ref={joinPasswordRef}
                onChange={handleChange}
              />
            )}
            <label
              htmlFor="team-description"
              className="block mb-1 text-xs font-medium text-white"
            >
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

            <FormAction disabled={loading} text="Zapisz zmiany" />
          </form>
        )}
      </div>
    </div>
  )
}
