import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import MemberList from "./MemberList"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function TeamDashboard() {
  const { leagueId, teamId } = useParams()
  const { getTeamData, getUserInfoByReference } = useAuth()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teamCaptain, setTeamCaptain] = useState(null)

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {teamData && (
          <div className="bg-gray-500/[.2] p-6 rounded-lg shadow-md">
            <h1 className="font-bold text-lg pb-2">Informacje:</h1>
            {teamCaptain && (
              <p className="flex items-center">
                Kapitan drużyny: {teamCaptain.firstName} {teamCaptain.lastName}
              </p>
            )}
            <p className="pb-2">Opis: {teamData.teamDescription}</p>
          </div>
        )}
        <div className="bg-gray-500/[.2] p-6 rounded-lg shadow-md">
          <h1 className="font-bold text-lg pb-2">Lista zawodników:</h1>
          {teamData && <MemberList members={teamData.players} />}
        </div>
      </div>
    </div>
  )
}
