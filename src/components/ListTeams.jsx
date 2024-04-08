export default function ListTeams({ teams, onClick }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Lista drużyn</h1>
      <ul className="mt-4">
        {teams.map((team) => (
          <li
            key={team.id}
            className="flex justify-between items-center p-2 bg-gray-800 text-white rounded-lg mb-2"
          >
            <div>
              <h2 className="text-lg font-bold">{team.teamName}</h2>
            </div>
            <button
              className="bg-fourth hover:bg-third text-white px-4 py-2 rounded-lg"
              onClick={onClick}
            >
              Dołącz
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
