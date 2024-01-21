import FormHeader from "../components/FormHeader"
import Login from "../components/Login"

export default function LoginPage() {
  return (
    <>
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
