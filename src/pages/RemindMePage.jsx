import { RemindMe, FormHeader } from "../components"

export default function RemindMePage() {
  return (
    <div className="h-[350px] w-full my-auto px-3 sm:px-5 flex items-center justify-center ">
      <div className=" h-[300px] flex flex-col justify-center my-auto w-2/3 lg:w-1/5 px-3 bg-gray-500/[.2] bg-clip-padding backdrop-filter backdrop-blur-sm text-white py-4 rounded-lg">
        <FormHeader heading="Przypomnij hasło" />
        <RemindMe />
      </div>
    </div>
  )
}
