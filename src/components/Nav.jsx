import { Link, NavLink } from "react-router-dom"

export default function Nav() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-purple-500 p-6">
      <ul className="flex items-center flex-shrink-0 text-white mr-6">
        <li>
          <NavLink to="/">Strona główna</NavLink>
        </li>
        <li>
          <NavLink to="/login">Logowanie</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Rejestracja</NavLink>
        </li>
      </ul>
    </nav>
  )
}
