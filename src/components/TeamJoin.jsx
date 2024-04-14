import { useRef, useState, useEffect } from "react"
import Input from "./Input"
import ListTeams from "./ListTeams"
import { AiOutlineSearch } from "react-icons/ai"
import { useAuth } from "../contexts/AuthContext"
import { render } from "react-dom"

export default function TeamJoin() {
  const [searchState, setSearchState] = useState("")
  const { getLeagues, getTeamsByLeagueId } = useAuth()
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState("")
  const [teams, setTeams] = useState([])
  const [searchConditionCompleted, setSearchConditionCompleted] =
    useState(false)
  const [filteredTeams, setFilteredTeams] = useState([]) // State to store filtered teams

  const searchTeamRef = useRef()

  const fixedInputClass =
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  const handleChange = (e) => {
    setSearchState(e.target.value)
    filterTeams(e.target.value)
  }

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value)

    if (e.target.value !== "") {
      getTeamsByLeagueId(e.target.value, searchState)
        .then((teams) => {
          console.log("Teams fetched", teams)
          setTeams(teams)
          setFilteredTeams(teams)
          setSearchConditionCompleted(true)
        })
        .catch((e) => {
          console.error("An error occurred while fetching teams", e)
        })
    }
  }

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

  useEffect(() => {
    // Filter teams based on the current search query
    const filtered = teams.filter((team) =>
      team.teamName?.toLowerCase().includes(searchState.toLowerCase())
    )
    setFilteredTeams(filtered)
  }, [searchState, teams])

  const filterTeams = (query) => {
    const filtered = teams.filter((team) =>
      team.teamName?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredTeams(filtered)
  }

  return (
    <>
      <div>
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">Dołącz do drużyny</h1>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <Input
            key={"search-team"}
            handleChange={handleChange}
            value={searchState}
            id={"search-team"}
            name={"search-team"}
            type={"text"}
            autoComplete={"false"}
            isRequired={true}
            ref={searchTeamRef}
            placeholder={"Wyszukaj drużynę"}
            customClass={"h-8"}
          />
          <AiOutlineSearch size={25} className=" text-fourth" />
        </div>

        <div>
          <label
            htmlFor="choose-league"
            className="block mb-2 text-lg font-medium text-white"
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
      </div>
      <div className="flex justify-center items-center w-full">
        {searchConditionCompleted && filteredTeams.length > 0 ? (
          <ListTeams teams={filteredTeams} leagueId={selectedLeague} />
        ) : searchConditionCompleted && filteredTeams.length === 0 ? (
          <p>Brak drużyn spełniających kryteria</p>
        ) : null}
      </div>
    </>
  )
}
