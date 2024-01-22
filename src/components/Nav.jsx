import { NavLink } from "react-router-dom"

const NavLinks = () => {
  return (
    <>
      <NavLink to="/" className="mx-2">
        Strona główna
      </NavLink>

      <NavLink to="/login" className="mx-2">
        Logowanie
      </NavLink>

      <NavLink to="/signup" className="mx-2">
        Rejestracja
      </NavLink>
    </>
  )
}

export default function Nav() {
  return (
    <>
      <nav className="flex flex-[1] items-center justify-end overflow-hidden">
        <div className="hidden justify-end md:flex">
          <NavLinks />
        </div>
      </nav>
    </>
  )
}
