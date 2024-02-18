import { RemindMe, FormHeader } from "../components"

export default function RemindMePage() {
  return (
    <>
      <div className="mt-2 md:mt-20">
        <FormHeader heading="Przypomnij hasło" />
        <RemindMe />
      </div>
    </>
  )
}
