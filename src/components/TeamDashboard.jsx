import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLocation } from "react-router-dom"
import Alert from "./Alert"
import Spinner from "./Spinner"
import MemberList from "./MemberList"

export default function TeamDashboard() {
  const { leagueId, teamId } = useParams()
  const { getTeamData, getUserInfoByReference, joinTeam, userInfos } = useAuth()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teamCaptain, setTeamCaptain] = useState(null)
  const location = useLocation()
  const message = location.state?.message

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
  }, [leagueId, teamId])

  useEffect(() => {
    if (teamData && teamData.captain) {
      getUserInfoByReference(teamData.captain)
        .then((result) => {
          setTeamCaptain(result)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [teamData])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto py-8">
      {teamData && (
        <div className="flex justify-center">
          <h1 className=" text-3xl">Profil drużyny - {teamData.teamName}</h1>
        </div>
      )}
      {message && <Alert message={message} type={"success"} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {teamData && (
          <div className="bg-gray-500/[.2] p-6 rounded-lg shadow-md">
            <h1 className="font-bold text-lg pb-2">Informacje:</h1>
            {teamCaptain && (
              <p className="flex items-center">
                Kapitan drużyny: {teamCaptain.firstName} {teamCaptain.lastName}
              </p>
            )}

            <span className="flex">
              <p className=" mr-1">Opis: </p>
              {teamData.teamDescription !== "" ? (
                <i> {teamData.teamDescription}</i>
              ) : (
                <p className="text-red-700 text-base">Brak</p>
              )}
            </span>
          </div>
        )}
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
      </div>
    </div>
  )
}
