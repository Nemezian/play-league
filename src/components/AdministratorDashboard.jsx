import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"
import Alert from "./Alert"
import FormHeader from "./FormHeader"
import { useEffect, useState } from "react"

export default function AdministratorDashboard() {
    const {
        generateMatchSchedule,
        deleteAllMatchesButFirst,
        getLeagues,
        getLeagueStandings,
      } = useAuth()

        const [selectedLeague, setSelectedLeague] = useState("")
        const [leagues, setLeagues] = useState([])
        const fixedInputClass =
        "rounded-lg appearance-none bg-secondary  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-500 placeholder-gray-500 text-white focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"
    
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


    const handleScheduleGeneration = () => {
        console.log("Generowanie meczy dla ligi: ", selectedLeague)
        generateMatchSchedule(selectedLeague)
          .then(() => {
            console.log("Mecze wygenerowane")
          })
          .catch((e) => {
            console.error("An error occurred while generating matches", e)
          })
      }
    
      const handleDeleteMatches = () => {
        deleteAllMatchesButFirst(selectedLeague)
          .then(() => {
            console.log("Mecze usunięte")
          })
          .catch((e) => {
            console.error("An error occurred while deleting matches", e)
          })
      }

      const handleLeagueChange = (e) => {
        setSelectedLeague(e.target.value)
      }

   
      
return(<> 

    <FormHeader heading="Panel administratora" />
    <div className="flex flex-col items-center justify-center">
    
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
  <button
    className="block rounded py-2 px-2 hover:bg-red-700 bg-red-500 w-full mb-1"
    onClick={handleScheduleGeneration}
  >
    <span className="text-xs sm:text-sm lg:text-base">
      Wygeneruj mecze
    </span>
  </button>
  </div>
  <button
    className="block rounded py-2 px-2 hover:bg-red-700 bg-red-500 w-full mb-1"
    onClick={handleDeleteMatches}
  >
    <span className="text-xs sm:text-sm lg:text-base">
      Test usuwania meczy
    </span>
  </button>
  </>)
}