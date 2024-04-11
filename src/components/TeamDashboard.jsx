import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import MemberList from "./MemberList"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function TeamDashboard() {
  const { leagueId, teamId } = useParams()
  const { getTeamData } = useAuth()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTeamData(leagueId, teamId)
      .then((data) => {
        setTeamData(data)
        setLoading(false)
        console.log("Team data: ", teamData)
        console.log
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [leagueId, teamId])

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      {console.log(teamData)}
      {teamData && (
        <div>
          <h1 className=" ">Drużyna - {teamData.teamName}</h1>
          <div>
            <p>Opis: {teamData.teamDescription}</p>
          </div>
        </div>
      )}
      {teamData && (
        <div>
          <MemberList members={teamData.players} />
        </div>
      )}
    </div>
  )
}
