import LastFiveIcon from "./LastFiveIcon"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"
import Alert from "./Alert"
import { useNavigate, useParams } from "react-router-dom"

export default function Standings() {
  const {
    getLeagueStandings,
    getLeagues,
  } = useAuth()
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("")
  const [leagues, setLeagues] = useState([])
  const navigate = useNavigate()
  const { leagueId } = useParams()

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

  useEffect(() => {
    if (leagueId) {
      setSelectedLeague(leagueId)
    }
  }, [leagueId])

  useEffect(() => {
    // Fetch standings when leagueId changes in the URL
    setLoading(true)
    setError("")

    if (!leagueId) {
      setLoading(false)
      return
    }

    getLeagueStandings(leagueId)
      .then((standings) => {
        console.log("Standings fetched", standings)

        if (standings) {
          const sortedStandings = sortStandings(standings)
          setStandings(sortedStandings)
        } else {
          setError("Nie znaleziono tabeli dla wybranej ligi")
          setStandings([])
        }

        setLoading(false)
      })
      .catch((e) => {
        console.error("An error occurred while fetching standings", e)
        setError("Wystąpił błąd podczas pobierania danych. Spróbuj ponownie.")
        setLoading(false)
      })
  }, [leagueId])

  const sortStandings = (standings) => {
    return standings.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points // Sort by points descending
      } else if (a.matchesPlayed !== b.matchesPlayed) {
        return a.matchesPlayed - b.matchesPlayed // Sort by matches played ascending
      } else {
        return b.wins - a.wins // Sort by wins descending
      }
    })
  }
  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value)

    navigate(`/standings/${e.target.value}`)
  }

  const handleTeamClick = (team) => {
    navigate(`/team/${selectedLeague}/${team}`)
  }

  if (loading) return <Spinner />

  return (
    <>
      <h1 className="text-3xl text-gray-white font-extrabold mb-8">
        Tabele ligowe
      </h1>

      <div>
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
      {error && <Alert message={error} type="error" />}
      <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden sm:rounded-lg">
              {leagueId === "" && standings.length === 0 ? (
                <div className="text-center p-4 text-gray-400">Brak danych</div>
              ) : (
                <table className="min-w-full text-sm text-gray-400">
                  <thead className="bg-gray-800 text-xs uppercase font-medium">
                    <tr>
                      <th></th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        Klub
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        MR
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        W
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        R
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        P
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        Pkt
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left tracking-wider"
                      >
                        Ostatnie 5
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800">
                    {standings.map(
                      (team, index) => (
                        (
                          <tr
                            key={team.id}
                            className={
                              index % 2 == 0 ? "bg-black bg-opacity-20" : ""
                            }
                          >
                            <td className="pl-4">{index + 1}.</td>
                            <td className="px-6 py-2 whitespace-nowrap text-left ">
                              <button
                                className="hover:text-gray-600"
                                onClick={() => handleTeamClick(team.id)}
                              >
                                {team.teamName}
                              </button>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {team.matchesPlayed}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {team.wins}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {team.draws}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {team.losses}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {team.points}
                            </td>
                            <td className="flex px-6 py-2 whitespace-nowrap">
                              {team.lastFive.map((result, index) =>
                                result === null ? (
                                  <span className="text-lg text-bold px-[0.2rem]">
                                    -
                                  </span>
                                ) : (
                                  <LastFiveIcon
                                    key={index + Math.random(100)}
                                    type={result}
                                  />
                                )
                              )}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
