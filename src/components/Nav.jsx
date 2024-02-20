import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"

export default function Nav() {
  const [nav, setNav] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")

  useEffect(() => {
    // Add logic here to handle user login/logout
    // For example, you can update the navbar state based on the currentUser value
    setNav(false) // Reset the navbar state on login/logout
  }, [currentUser])

  const handleNav = () => {
    setNav(!nav)
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
      <div className="hidden md:flex">
        <NavLink
          className="block p-3 whitespace-nowrap hover:text-gray-400"
          to="/"
        >
          Strona główna
        </NavLink>
        {!currentUser ? (
          <NavLink
            className="block p-3 whitespace-nowrap hover:text-gray-400"
            to="/signup"
          >
            Rejestracja
          </NavLink>
        ) : (
          <NavLink
            className="block p-3 whitespace-nowrap hover:text-gray-400"
            to="/dashboard"
          >
            Panel użytkownika
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
      <button onClick={handleNav} className="block md:hidden">
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
          <button onClick={handleNav} className="block md:hidden">
            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </button>
        </div>
        <NavLink
          className="block p-3 border-b border-secondary hover:bg-secondary"
          to="/"
        >
          Strona główna
        </NavLink>

        {!currentUser ? (
          <NavLink
            className="block p-3 border-b border-secondary hover:bg-secondary"
            to="/signup"
          >
            Rejestracja
          </NavLink>
        ) : (
          <NavLink
            className="block p-3 border-b border-secondary hover:bg-secondary"
            to="/dashboard"
          >
            Panel użytkownika
          </NavLink>
        )}
        {currentUser ? (
          <button
            className="block p-3 bg-fourth hover:bg-third"
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
