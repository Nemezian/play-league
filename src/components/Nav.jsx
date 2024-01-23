// Note: Navbar component
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react"
import { DarkThemeToggle } from "flowbite-react"
import { useState } from "react"

export default function Nav() {
  return (
    <Navbar
      fluid
      rounded
      className="w-full py-4 justify-between justify-items-center"
    >
      <NavbarBrand href="/" className="">
        <img
          src="/src/assets/logo_L.png"
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Play League
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button href="login">Zaloguj się</Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse className="">
        <NavbarLink href="/" className="pt-3" active>
          Strona główna
        </NavbarLink>
        <NavbarLink href="signup" className="pt-3">
          Rejestracja
        </NavbarLink>
      </NavbarCollapse>
      <DarkThemeToggle />
    </Navbar>
  )
}
