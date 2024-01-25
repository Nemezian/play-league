import { useState } from "react"
import { NavLink } from "react-router-dom"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"

export default function Nav() {
  const [nav, setNav] = useState(false)

  const handleNav = () => {
    setNav(!nav)
  }

  return (
    <nav className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="w-full text-3xl font-bold uppercase justify-start text-fourth text">
        <NavLink to="/">Play league</NavLink>
      </h1>
      <div className="hidden md:flex">
        <NavLink
          className="block p-3 whitespace-nowrap hover:bg-secondary"
          to="/"
        >
          Strona główna
        </NavLink>
        <NavLink
          className="block p-3 whitespace-nowrap hover:bg-secondary"
          to="/signup"
        >
          Rejestracja
        </NavLink>
        <NavLink
          className="block px-4 py-3 bg-fourth rounded whitespace-nowrap hover:bg-third"
          to="/login"
        >
          Zaloguj się
        </NavLink>
      </div>
      <button onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </button>
      <div
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-secondary bg-primary ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-fourth m-4 uppercase">
          Play league
        </h1>
        <NavLink
          className="block p-3 border-b border-secondary hover:bg-secondary"
          to="/"
        >
          Strona główna
        </NavLink>

        <NavLink
          className="block p-3 border-b border-secondary hover:bg-secondary"
          to="/signup"
        >
          Rejestracja
        </NavLink>

        <NavLink
          className="block px-4 py-3 bg-fourth hover:bg-third"
          to="/login"
        >
          Zaloguj się
        </NavLink>
      </div>
    </nav>
  )
}
