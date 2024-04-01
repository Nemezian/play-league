export default function TeamJoin() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dołącz do drużyny</h1>
      <form className="mt-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="team-name" className="text-white">
            Nazwa drużyny
          </label>
          <input
            type="text"
            id="team-name"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <label htmlFor="team-description" className="text-white">
            Opis drużyny
          </label>
          <textarea
            id="team-description"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <button className="mt-4 bg-blue-500 text-white py-2 rounded-lg">
          Dołącz do drużyny
        </button>
      </form>
    </div>
  )
}
