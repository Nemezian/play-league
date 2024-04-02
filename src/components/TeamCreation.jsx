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
  const { createTeam, getLeagues } = useAuth()
  const nameRef = useRef()
  const descriptionRef = useRef()

  const fixedInputClass =
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  //   return (
  //     <div>
  //       <h1 className="text-2xl font-bold text-white">Stwórz drużynę</h1>
  //       <form className="mt-4">
  //         <div className="flex flex-col space-y-2">
  //           <label htmlFor="team-name" className="text-white">
  //             Nazwa drużyny
  //           </label>
  //           <input
  //             type="text"
  //             id="team-name"
  //             className="p-2 bg-gray-500/[.8] rounded-lg"
  //           />
  //         </div>
  //         <div className="flex flex-col space-y-2 mt-4">
  //           <label htmlFor="team-description" className="text-white">
  //             Opis drużyny
  //           </label>
  //           <textarea
  //             id="team-description"
  //             className="p-2 bg-gray-500/[.8] rounded-lg"
  //           />
  //         </div>

  //         <FormAction text="Stwórz drużynę" />
  //       </form>
  //     </div>
  //   )

  useEffect(() => {
    // Fetch leagues from Firestore
    getLeagues()
      .then((leagues) => {
        console.log("Leagues fetched", leagues)
        setLeagues(leagues)
      })
      .catch((e) => {
        console.error("An error occurred while fetching leagues", e)
      })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    createTeam(
      nameRef.current.value.trim(),
      descriptionRef.current.value.trim(),
      selectedLeague
    )
      .then(() => {
        // navigate("/")
        setMessage("Drużyna została stworzona")
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
        <Input
          key={"team-name"}
          handleChange={handleChange}
          value={changeState["team-name"]}
          labelText={"Nazwa drużyny"}
          labelFor={"team-name"}
          id={"team-name"}
          name={"team-name"}
          type={"text"}
          autoComplete={"false"}
          isRequired={true}
          ref={nameRef}
          placeholder={"Nazwa drużyny"}
        />
        <div>
          <label htmlFor="choose-league" className="text-white">
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
        <div className="flex flex-col space-y-2 mt-4">
          <label htmlFor="team-description" className="text-white">
            Opis drużyny
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

        <FormAction disabled={loading} text="Stwórz drużynę" />
      </form>
    </>
  )
}
