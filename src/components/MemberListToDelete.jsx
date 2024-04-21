import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function MemberListToDelete({
  members,
  divClassName = "",
  listClassName = "",
  itemsClassName = "",
  page = 1,
  pageSize = 10,
}) {
  const { getMembersData, kickTeamMember } = useAuth()
  const [membersData, setMembersData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getMembersData(members)
      .then((data) => {
        setMembersData(data)
      })
      .catch((error) => {
        console.error("An error occurred while fetching members data", error)
      })
      .finally(() => setLoading(false))
  }, [members])

  const handleKickPlayer = (playerId) => {
    return () => {
      setLoading(true)
      kickTeamMember(playerId)
        .then(() => {
          setLoading(true)
          setMembersData((prevData) =>
            prevData.filter((player) => player.id !== playerId)
          )
        })
        .catch((error) => {
          console.error("An error occurred while kicking the player", error)
        })
        .finally(() => setLoading(false))
    }
  }

  if (loading) {
    return <Spinner positioning=" flex justify-center" />
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = membersData.slice(startIndex, endIndex)

  return (
    <div className={divClassName}>
      {paginatedData && (
        <ul className={listClassName}>
          {paginatedData.map((player, index) => (
            <li key={index} className={itemsClassName}>
              <p>
                {startIndex + index + 1}. {player.firstName} {player.lastName}
              </p>

              <button
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded-lg"
                onClick={handleKickPlayer(player.id)}
              >
                Wyrzuć
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
