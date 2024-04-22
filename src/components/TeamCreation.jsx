import { useState, useRef, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { teamCreationFields } from "../constants/formFields"
import FormAction from "./FormAction"
import Alert from "./Alert"
import Input from "./Input"

const fields = teamCreationFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ""))

export default function TeamCreation() {
  const [loading, setLoading] = useState(false)
  const [changeState, setChangeState] = useState(fieldsState)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState("")
  const { createTeam, getLeagues, userInfos, countLeagueTeams } = useAuth()
  const nameRef = useRef()
  const teamCodeRef = useRef()
  const descriptionRef = useRef()
  const [preferredMatchDays, setPreferredMatchDays] = useState([])
  const [leagueTeamCount, setLeagueTeamCount] = useState(0)
  const weekDays = [
    ["monday", "Poniedziałek"],
    ["tuesday", "Wtorek"],
    ["wednesday", "Środa"],
    ["thursday", "Czwartek"],
    ["friday", "Piątek"],
    ["saturday", "Sobota"],
    ["sunday", "Niedziela"],
  ]
  const navigate = useNavigate()

  const fixedInputClass =
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  useEffect(() => {
    // Fetch leagues from Firestore
    getLeagues()
      .then((leagues) => {
        console.log("Leagues fetched", leagues)
        setLeagues(leagues)
        for (let i = 0; i < leagues.length; i++) {
          countLeagueTeams(leagues[i].id)
            .then((countLeagueTeams) => {
              setLeagueTeamCount((prev) => [...prev, countLeagueTeams])
              console.log("League team count fetched", countLeagueTeams)
            })
            .catch((e) => {
              console.error("An error occurred while fetching leagues", e)
            })
        }
      })
      .catch((e) => {
        console.error("An error occurred while fetching leagues", e)
      })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    setError("")

    if (selectedLeague === "") {
      setError("Proszę najpierw wybrać ligę")
      setLoading(false)
      return
    }
    if (userInfos.role === "member") {
      setError("Jesteś już członkiem drużyny!")
      setLoading(false)
      return
    }

    createTeam(
      nameRef.current.value.trim(),
      descriptionRef.current.value.trim(),
      selectedLeague,
      teamCodeRef.current.value.trim(),
      preferredMatchDays
    )
      .then(() => {
        navigate("/", { state: { message: "Drużyna została stworzona" } })
      })
      .catch((e) => {
        setError("Nie udało się stworzyć drużyny")
        console.error("An error occurred while creating a team", e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (e) => {
    setChangeState({ ...changeState, [e.target.id]: e.target.value })
  }

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value)
  }

  return (
    <>
      {error && (
        <Alert message={error} type="error">
          {error}
        </Alert>
      )}
      {message && (
        <Alert message={message} type="success">
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={changeState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            customClass={field.customClass}
            isRequired={field.isRequired}
            ref={
              field.id === "team-name"
                ? nameRef
                : field.id === "team-code"
                  ? teamCodeRef
                  : null
            }
            placeholder={field.placeholder}
          />
        ))}
        <div>
          <label
            htmlFor="choose-league"
            className="block mb-2 text-xs font-medium text-white"
          >
            Wybierz ligę
          </label>
          <select
            id="choose-league"
            value={selectedLeague}
            onChange={handleLeagueChange}
            name="choose-league"
            className={fixedInputClass}
          >
            <option value="">-- Wybierz ligę --</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.leagueName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="team-description"
            className="flex mb-2 text-xs font-medium text-white"
          >
            Opis drużyny<p className="font-thin block">(opcjonalnie)</p>
          </label>
          <textarea
            id="team-description"
            name="team-description"
            type="longText"
            placeholder="Opis drużyny"
            className={fixedInputClass + " resize-none"}
            ref={descriptionRef}
            cols={30}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <h1 className="mx-auto">
            Preferowane dni rozgrywek(pozostaw puste, jeśli brak)
          </h1>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 w-full max-w-sm">
              {weekDays.map((day) => (
                <div key={day[0]} className="ml-14">
                  <input
                    type="checkbox"
                    className="mr-1 h-4 w-4 text-fourth focus:ring-third border-gray-300 rounded"
                    id={day[0]}
                    value={day[0]}
                    isrequired={"false"}
                    onChange={(e) =>
                      setPreferredMatchDays([
                        ...preferredMatchDays,
                        e.target.value,
                      ])
                    }
                  />
                  <label className="text-sm text-white" htmlFor={day[0]}>
                    {day[1]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FormAction disabled={loading} text="Stwórz drużynę" />
      </form>
    </>
  )
}
