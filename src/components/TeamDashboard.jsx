import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
// import TeamDetails from "./TeamDetails"
// import MemberList from "./MemberList"
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
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [leagueId, teamId]);

    if (loading) {
      return <Spinner />
    }

  return (
    <div>
      <h1>Team Dashboard - {teamData.teamName}</h1>
      <div>
      <p>Description: {teamData.teamDescription}</p>
        {/* <TeamDetails team={teamData} />
        <MemberList members={teamData.players} /> */}
      </div>
    </div>
  )
}
