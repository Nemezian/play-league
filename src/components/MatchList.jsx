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
  const { scheduleLoading } = useAuth()
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
              <div className="flex flex-row items-center justify-between">
              <div className="text-start w-1/3 text-sm">
                <span>{match.roundNo}</span>
                <span>. kolejka</span>
                </div>
              <div className="text-center w-1/3 text-sm">
                {match.timestampDay} {match.timestampHour}
              </div>
              <div className="text-end w-1/3 text-sm">
                <span > {match.status === "upcoming" ? "Mecz nadchodzący" :
                  match.status === "finished" ? "Mecz zakończony" :
                  match.status === 'notPlayed' ? "Mecz nierozegrany": ""}</span>  
                </div>
                </div>
              <div className="flex flex-row  items-center justify-between text-xl font-bold">
                <span
                  className={
                    highlightTeam === match.homeTeamName ? "text-fourth w-1/3" : "w-1/3"
                  }>
                  {match.homeTeamName}
                </span>
              <div className="w-1/3 text-center">
                <span className="text-ultrabold text-2xl">{match.result.homeScore || "-"}</span>
                <span> : </span>
                <span className="text-ultrabold text-2xl">{match.result.awayScore || "-"}</span>
              </div>
                <span
                  className={
                    highlightTeam === match.awayTeamName ? "text-fourth text-end w-1/3" : " text-end w-1/3"
                  }
                >
                  {match.awayTeamName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
