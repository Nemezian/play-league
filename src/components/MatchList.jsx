import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function MatchList({
  matches,
  divClassName = "",
  listClassName = "",
  itemsClassName = "",
  page = 1,
  pageSize = 10,
  currentTeamName,
}) {
  const { getTeamSchedule, scheduleLoading } = useAuth()
  const [matchesData, setMatchesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highlightTeam, setHighlightTeam] = useState(null)

  useEffect(() => {
    setLoading(true)

    if (matches) {
      setLoading(false)
    }
  }, [matches])

  useEffect(() => {
    setLoading(true)
    if (matches) {
      const teamName = currentTeamName
      setHighlightTeam(teamName)
      setLoading(false)
    }
  }, [matches, currentTeamName])

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = matches.slice(startIndex, endIndex)

  if (loading || scheduleLoading) {
    return <Spinner positioning=" flex justify-center" />
  }
  return (
    <div className={divClassName}>
      {paginatedData && (
        <div className={listClassName}>
          {paginatedData.map((match, index) => (
            <div key={index} className={itemsClassName}>
              <p className="text-center text-white text-sm">
                {match.timestampDay} {match.timestampHour}
              </p>
              <div className="flex flex-row  items-center justify-between text-xl font-bold">
                <span
                  className={
                    highlightTeam === match.homeTeamName ? "text-fourth" : ""
                  }
                >
                  {match.homeTeamName}
                </span>
                <span> vs </span>
                <span
                  className={
                    highlightTeam === match.awayTeamName ? "text-fourth" : ""
                  }
                >
                  {match.awayTeamName}
                </span>
              </div>
              {/* <p className="text-white">{match.dateTime}</p> */}
              {/* <p className="text-white">{match.location}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
