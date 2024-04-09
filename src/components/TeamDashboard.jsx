import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import TeamDetails from "./TeamDetails"
import MemberList from "./MemberList"
import EventCalendar from "./EventCalendar"
import TaskList from "./TaskList"
import { getTeamData } from "../api/teamApi"

export default function TeamDashboard() {
  const { teamId } = useParams()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamData(teamId)
        setTeamData(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [teamId])

  //   if (loading) {
  //     return <div>Loading...</div>
  //   }

  //   if (error) {
  //     return <div>Error: {error}</div>
  //   }

  return (
    <div>
      <h1>Team Dashboard - {teamData.name}</h1>
      <div>
        <TeamDetails team={teamData} />
        <MemberList members={teamData.members} />
        <EventCalendar events={teamData.events} />
        <TaskList tasks={teamData.tasks} />
      </div>
    </div>
  )
}
