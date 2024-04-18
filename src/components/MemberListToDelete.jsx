import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function MemberListToDelete({
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
    return <Spinner positioning=" flex justify-center" />
  }

  return (
    <div className={divClassName}>
      {membersData && (
        <ul className={listClassName}>
          {membersData.map((player, index) => (
            <li key={index} className={itemsClassName}>
              <p>
                {index + 1}. {player.firstName} {player.lastName}
              </p>

              <button className="bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded-lg">
                Wyrzuć
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
