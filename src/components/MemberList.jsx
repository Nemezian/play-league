import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function MemberList({ members }) {
  const { getMembersData } = useAuth()
  const [membersData, setMembersData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(members)
    getMembersData(members)
      .then((data) => {
        console.log("data", data)
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
    <div className="h-10">
      <h2>Lista członków: </h2>
      {membersData && (
        <div>
          <ul className="">
            {membersData.map((player, index) => (
              <li key={index}>
                {player.firstName} {player.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
