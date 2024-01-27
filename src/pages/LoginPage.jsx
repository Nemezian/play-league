import { Footer, FormHeader, Login, Nav } from "../components"

export default function LoginPage() {
  return (
    <>
      <Nav />
      <div className="mt-2 md:mt-20">
        <FormHeader
          heading="Zaloguj się"
          paragraph="Nie masz jeszcze konta? Zarejestruj się tutaj:"
          linkName="Rejestracja"
          linkUrl="/signup"
        />
        <Login />
      </div>
      <Footer />
    </>
  )
}
