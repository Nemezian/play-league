import { FormHeader, Login, Nav } from "../components"

export default function LoginPage() {
  return (
    <>
      <Nav />
      <FormHeader
        heading="Zaloguj się"
        paragraph="Nie masz jeszcze konta? Zarejestruj się tutaj:"
        linkName="Rejestracja"
        linkUrl="/signup"
      />
      <Login />
    </>
  )
}
