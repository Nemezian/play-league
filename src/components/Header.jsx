// import Logo from "./Logo"
import Nav from "./Nav"

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 py-2">
      <div className="flex items-center">
        {/* <Logo /> */}
        Logo
      </div>
      <Nav />
    </header>
  )
}
