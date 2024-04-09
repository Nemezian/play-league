import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai"

export default function Nav() {
  const [nav, setNav] = useState(false)
  const { currentUser, logout, getUserRole, userInfos } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setDropdownOpen(false)
    setNav(false) // Reset the navbar state on login/logout
  }, [currentUser])

  const handleNav = () => {
    setNav(!nav)
  }

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen)
  }

  function handleLogout(e) {
    e.preventDefault()

    setError("")
    logout()
      .then(() => {
        navigate("/login")
        console.log("Logged out")
      })
      .catch((e) => {
        setError("Failed to log out")
        console.log("Could not log out")
        console.error("An error occurred while logging out", e)
      })
  }

  return (
    <nav className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="w-full text-5xl font-BlackopsOne uppercase justify-start text-fourth">
        <NavLink to="/">Play league</NavLink>
      </h1>
      <div className="hidden lg:flex">
        <NavLink
          className="block p-3 whitespace-nowrap hover:text-gray-400"
          to="/"
        >
          Strona główna
        </NavLink>

        {currentUser && userInfos && (
          <div className="relative">
            <button
              className="flex items-center p-3 whitespace-nowrap hover:text-gray-400"
              onClick={handleDropdownToggle}
            >
              Menu drużyn
              {dropdownOpen ? (
                <AiFillCaretUp className="ml-1" />
              ) : (
                <AiFillCaretDown className="ml-1" />
              )}
            </button>
            {dropdownOpen && (
              <div className="block absolute items-center justify-center -left-1 w-[150px] z-[49] mt-1 bg-fourth rounded-md">
                {(userInfos.role === "captain" ||
                  userInfos.role === "administrator") && (
                  <NavLink
                    className="block p-2 hover:bg-third"
                    to="/team-management"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Zarządzaj drużyną
                  </NavLink>
                )}
                {(userInfos.role === "player" ||
                  userInfos.role === "administrator") && (
                  <NavLink
                    className="block p-2 hover:bg-third"
                    to="/team-creation"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Stwórz drużynę
                  </NavLink>
                )}
                {(userInfos.role === "player" ||
                  userInfos.role === "administrator") && (
                  <NavLink
                    className="block p-2 hover:bg-third"
                    to="/team-join"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dołącz do drużyny
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {currentUser ? (
          <NavLink
            className="block p-3 whitespace-nowrap hover:text-gray-400"
            to="/dashboard"
          >
            Panel użytkownika
          </NavLink>
        ) : (
          <NavLink
            className="block p-3 whitespace-nowrap hover:text-gray-400"
            to="/signup"
          >
            Rejestracja
          </NavLink>
        )}
        {currentUser ? (
          <button
            className="block px-4 py-3 bg-fourth rounded whitespace-nowrap hover:bg-third"
            onClick={handleLogout}
          >
            Wyloguj się
          </button>
        ) : (
          <NavLink
            className="block px-4 py-3 bg-fourth rounded whitespace-nowrap hover:bg-third"
            to="/login"
          >
            Zaloguj się
          </NavLink>
        )}
      </div>
      <button onClick={handleNav} className="block lg:hidden">
        {!nav && <AiOutlineMenu size={20} />}
      </button>
      <div
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-secondary bg-primary ease-in-out duration-500 z-50"
            : "fixed ease-in-out duration-500 left-[-100%]"
        }
      >
        <div className="flex justify-between mr-3">
          <h1 className=" text-2xl font-BlackopsOne text-fourth justify-start m-4 uppercase">
            Play league
          </h1>
          <button onClick={handleNav} className="block lg:hidden">
            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </button>
        </div>
        <NavLink
          className="block p-3 border-b border-secondary hover:bg-secondary"
          to="/"
        >
          Strona główna
        </NavLink>
        {currentUser && userInfos && (
          <>
            {(userInfos.role === "captain" ||
              userInfos.role === "administrator") && (
              <NavLink
                className="block p-3 border-b border-secondary hover:bg-secondary"
                to="/team-management"
              >
                Zarządzaj drużyną
              </NavLink>
            )}
            {(userInfos.role === "player" ||
              userInfos.role === "administrator") && (
              <NavLink
                className="block p-3 border-b border-secondary hover:bg-secondary"
                to="/team-creation"
              >
                Stwórz drużynę
              </NavLink>
            )}
            {(userInfos.role === "player" ||
              userInfos.role === "administrator") && (
              <NavLink
                className="block p-3 border-b border-secondary hover:bg-secondary"
                to="/team-join"
              >
                Dołącz do drużyny
              </NavLink>
            )}
          </>
        )}
        {currentUser ? (
          <NavLink
            className="block p-3 border-b border-secondary hover:bg-secondary"
            to="/dashboard"
          >
            Panel użytkownika
          </NavLink>
        ) : (
          <NavLink
            className="block p-3 border-b border-secondary hover:bg-secondary"
            to="/signup"
          >
            Rejestracja
          </NavLink>
        )}
        {currentUser ? (
          <button
            className="block p-3 bg-fourth hover:bg-third w-full text-start"
            onClick={logout}
          >
            Wyloguj się
          </button>
        ) : (
          <NavLink className="block p-3 bg-fourth hover:bg-third" to="/login">
            Zaloguj się
          </NavLink>
        )}
      </div>
    </nav>
  )
}
