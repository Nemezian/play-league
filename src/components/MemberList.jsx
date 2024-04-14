import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function MemberList({
  members,
  divClassName = "",
  listClassName = "",
  itemsClassName = "",
}) {
  const { getMembersData } = useAuth()
  const [membersData, setMembersData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMembersData(members)
      .then((data) => {
        setMembersData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("An error occurred while fetching members data", error)
        setLoading(false)
      })
  }, [members])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className={divClassName}>
      {membersData && (
        <ul className={listClassName}>
          {membersData.map((player, index) => (
            <li key={index} className={itemsClassName}>
              {player.firstName} {player.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
