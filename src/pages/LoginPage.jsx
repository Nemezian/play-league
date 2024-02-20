import { FormHeader, Login } from "../components"

export default function LoginPage() {
  return (
    <div className="h-[640px] px-3 sm:px-5 flex items-center justify-center ">
      <div className=" w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500/[.2] bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-30 py-4 rounded-lg">
        <FormHeader
          heading="Zaloguj się"
          paragraph="Nie masz jeszcze konta? Zarejestruj się tutaj:"
          linkName="Rejestracja"
          linkUrl="/signup"
        />
        <Login />
      </div>
    </div>
  )
}
