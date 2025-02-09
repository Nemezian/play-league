import { TeamCreation, FormHeader } from "../components"

export default function TeamCreationPage() {
  return (
    <div className="h-[640px] px-3 sm:px-5 flex items-center justify-center">
      <div className="my-auto w-full  md:w-1/2 px-6 bg-gray-500/[.2] z-30 bg-clip-padding backdrop-filter backdrop-blur-sm text-white py-4 rounded-lg">
        <FormHeader
          heading="Stwórz drużynę"
          paragraph="Masz już drużynę? Dołącz tutaj:"
          linkName="Dołącz"
          linkUrl="/team-join"
        />
        <TeamCreation />
      </div>
    </div>
  )
}
