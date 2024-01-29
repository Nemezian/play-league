import { Nav, Signup, FormHeader, Footer } from "../components"

export default function SignupPage() {
  return (
    <>
      <Nav />
      <div className="mt-2 md:mt-20">
        <FormHeader
          heading="Rejestracja"
          paragraph="Masz już konto? Zaloguj się tutaj:"
          linkName="Logowanie"
          linkUrl="/login"
        />
        <Signup />
      </div>
      <Footer />
    </>
  )
}
