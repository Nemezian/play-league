import { Link } from "react-router-dom"

export default function Nav() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-purple-500 p-6">
      <ul className="flex items-center flex-shrink-0 text-white mr-6">
        <li>
          <Link to="/">Strona główna</Link>
        </li>
        <li>
          <Link to="/login">Logowanie</Link>
        </li>
        <li>
          <Link to="/signup">Rejestracja</Link>
        </li>
      </ul>
    </nav>
  )
}
