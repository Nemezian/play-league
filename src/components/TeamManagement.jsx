import { useEffect, useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import MemberListToDelete from "./MemberListToDelete"
import FormAction from "./FormAction"
import Alert from "./Alert"
import FormHeader from "./FormHeader"
import ReactModal from "react-modal"
import PaginationButtons from "./PaginationButtons"
import { AiOutlineClose } from "react-icons/ai"

export default function TeamManagement() {
  const [teamData, setTeamData] = useState(null)
  const {
    getTeamDataByReference,
    userInfos,
    userInfoLoading,
    deleteTeam,
    updateTeamInfo,
    getTeamSchedule,
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
  const [preferredMatchDaysState, setPreferredMatchDaysState] = useState([])
  const weekDays = [
    ["monday", "Poniedziałek"],
    ["tuesday", "Wtorek"],
    ["wednesday", "Środa"],
    ["thursday", "Czwartek"],
    ["friday", "Piątek"],
    ["saturday", "Sobota"],
    ["sunday", "Niedziela"],
  ]
  const [teamMatches, setTeamMatches] = useState([])
  const [renderedComponent, setRenderedComponent] = useState("info")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // You can adjust the page size here
  const [totalPages, setTotalPages] = useState(0)
  const [modalIsOpen, setIsOpen] = useState(false)

  const fixedInputClass =
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  if (userInfoLoading) {
    return <Spinner />
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!userInfoLoading) {
      getTeamDataByReference(userInfos.teamId)
        .then((data) => {
          setTeamData(data)
          console.log("Team data fetched", data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }, [userInfos, userInfoLoading])

  useEffect(() => {
    if (teamData) {
      setPreferredMatchDays(teamData.preferredMatchDays)
      console.log("Preferred match days", preferredMatchDays)
    }
  }, [teamData])

  useEffect(() => {
    if (preferredMatchDays) {
      setPreferredMatchDaysState(preferredMatchDays)
    }
  }, [preferredMatchDays])

  useEffect(() => {
    if (teamData) {
      const total = Math.ceil(teamData.players.length / pageSize)
      setTotalPages(total)

      if (currentPage > total) {
        setCurrentPage(total)
      }
    }
  }, [teamData, pageSize])

  useEffect(() => {
    if (userInfos.teamId) {
      getTeamSchedule(userInfos.teamId)
        .then((data) => {
          setTeamMatches(data)
        })
        .catch((error) => {
          console.error("An error occurred while fetching team matches", error)
        })
    }
  }, [userInfos])

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
    setMessage("")
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

    updateTeamInfo(userInfos.teamId, queryTeamData)
      .then(() => {
        setMessage("Zaktualizowano dane drużyny")
        setTeamData((prevData) => ({
          ...prevData,
          teamName: queryTeamData.teamName,
          teamDescription: queryTeamData.teamDescription,
          joinPassword: queryTeamData.joinPassword,
        }))
      })
      .catch(() => setError("Błąd podczas aktualizacji danych drużyny"))
      .finally(() => setLoading(false))

    console.log("Updating team data", queryTeamData)
    // Update team data
  }

  const handleChangeWeekDay = (e) => {
    if (e.target.checked) {
      setPreferredMatchDaysState([...preferredMatchDaysState, e.target.value])
    } else {
      setPreferredMatchDaysState(
        preferredMatchDaysState.filter((day) => day !== e.target.value)
      )
    }
  }

  const handleSubmitDays = (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    const queryTeamData = {
      preferredMatchDays: preferredMatchDaysState,
    }

    updateTeamInfo(userInfos.teamId, queryTeamData)
      .then(() => {
        setMessage("Zaktualizowano dni rozgrywek")
        setTeamData((prevData) => ({
          ...prevData,
          preferredMatchDays: queryTeamData.preferredMatchDays,
        }))
      })
      .catch(() => setError("Błąd podczas aktualizacji dni rozgrywek"))
      .finally(() => setLoading(false))

    console.log("Updating team data", queryTeamData)
  }

  const handleComponentChange = (component) => {
    setError("")
    setMessage("")
    setRenderedComponent(component)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <div>
      <div>
        <ReactModal
          isOpen={modalIsOpen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={closeModal}
          className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-[400px]  h-auto z-50"
        >
          <div className="flex justify-end">
            <button className="block" onClick={closeModal}>
              <AiOutlineClose size={20} />
            </button>
          </div>
          <div>
            {error && <Alert message={error} type="error" />}

            <p className="text-sm md:text-base">
              Czy jesteś pewien, że chcesz usunąć drużynę?
            </p>
            <p className="text-sm opacity-80 text-red-500">
              Tej operacji nie można cofnąć.
            </p>

            <div className="flex flex-row justify-center ">
              <button
                className="bg-red-500 hover:bg-red-700 text-white text-sm md:text-base mt-3 py-1 px-5 rounded"
                onClick={() => handleDeleteTeam()}
              >
                Tak
              </button>
              <button
                className="bg-fourth hover:bg-third text-white text-sm md:text-base ml-2 mt-3 py-1 px-5 rounded"
                onClick={closeModal}
              >
                Nie
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
      <div className="flex flex-row justify-between items-center">
        <FormHeader heading="Panel zarządzania drużyną" />
      </div>
      {error && <Alert message={error} type="error" />}
      {message && <Alert message={message} type="success" />}
      <div className="flex flex-row justify-between items-start h-[24rem]">
        <nav className="flex flex-col justify-center items-center pr-2 mr-2 border-gray-500 border-r-2 w-3/12 h-full">
          <button
            className="block rounded py-2 px-2 hover:bg-gray-700 bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("info")}
          >
            <span className="text-xs sm:text-sm lg:text-base">
              Edytuj informacje
            </span>
          </button>
          <button
            className="block rounded py-2 px-2 hover:bg-gray-700 bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("members")}
          >
            <span className="text-xs sm:text-sm lg:text-base">Członkowie</span>
          </button>
          <button
            className="block rounded py-2 px-2 hover:bg-gray-700 bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("days")}
          >
            <span className="text-xs sm:text-sm lg:text-base">
              Dni rozgrywek
            </span>
          </button>
          <button
            className="block rounded py-2 px-2 hover:bg-gray-700 bg-gray-600 w-full mb-1"
            onClick={() => handleComponentChange("matches")}
          >
            <span className="text-xs sm:text-sm lg:text-base">Mecze</span>
          </button>
          <button
            className="block rounded py-2 px-2 hover:bg-red-700 bg-red-500 w-full mb-1"
            onClick={openModal}
          >
            <span className="text-xs sm:text-sm lg:text-base">
              Usuń drużynę
            </span>
          </button>
        </nav>
        {renderedComponent === "members" && (
          <div className="flex flex-col justify-between  w-full h-full">
            <div>
              <h1 className="font-bold text-lg pb-2 flex justify-center items-center">
                <span>Lista zawodników</span>
              </h1>
              {teamData && teamData.players.length > 0 ? (
                <>
                  <MemberListToDelete
                    members={teamData.players}
                    itemsClassName="flex justify-between items-center mb-1 bg-gray-300/[.2] p-1 rounded-md"
                    page={currentPage}
                    pageSize={pageSize}
                  />
                </>
              ) : (
                <p className="text-red-700 text-base text-center ">
                  Brak zawodników w drużynie
                </p>
              )}
            </div>
            <PaginationButtons
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              totalPages={totalPages}
              className="flex justify-center mt-4"
            />
          </div>
        )}
        {renderedComponent === "info" && (
          <form
            onSubmit={handleSubmit}
            className="w-full h-full flex flex-col justify-between"
          >
            {/* <AiOutlineEdit className="text-4xl text-fourth mb-4" /> */}
            <div>
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
            </div>
            <FormAction disabled={loading} text="Zapisz zmiany" />
          </form>
        )}
        {renderedComponent === "days" && (
          <form
            onSubmit={handleSubmitDays}
            className="w-full h-full flex flex-col justify-between"
          >
            <div className="flex flex-col">
              <h1 className="mx-auto font-bold text-lg pb-2">
                Preferowane dni rozgrywek
              </h1>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 w-full max-w-sm">
                  {teamData && (
                    <>
                      {weekDays.map((day) => (
                        <div key={day[0]} className="ml-14">
                          <input
                            type="checkbox"
                            className="mr-1 h-4 w-4 text-fourth focus:ring-third border-gray-300 rounded"
                            id={day[0]}
                            value={day[0]}
                            defaultChecked={
                              preferredMatchDays.length > 0
                                ? preferredMatchDays?.includes(day[0])
                                : false
                            }
                            onChange={handleChangeWeekDay}
                          />

                          <label
                            className="text-sm text-white"
                            htmlFor={day[0]}
                          >
                            {day[1]}
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <FormAction disabled={loading} text="Zapisz zmiany" />
          </form>
        )}
      </div>
    </div>
  )
}
