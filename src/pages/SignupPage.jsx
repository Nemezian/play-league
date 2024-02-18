import { Signup, FormHeader } from "../components"

export default function SignupPage() {
  return (
    <>
      <div className="mt-2 md:mt-20">
        <FormHeader
          heading="Rejestracja"
          paragraph="Masz już konto? Zaloguj się tutaj:"
          linkName="Logowanie"
          linkUrl="/login"
        />
        <Signup />
      </div>
    </>
  )
}
