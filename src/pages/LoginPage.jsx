import Header from "../components/Header"
import Login from "../components/Login"

export default function LoginPage() {
  return (
    <>
      <Header
        heading="Zaloguj się"
        paragraph="Nie masz jeszcze konta? Zarejestruj się tutaj:"
        linkName="Rejestracja"
        linkUrl="/signup"
      />
      <Login />
    </>
  )
}
