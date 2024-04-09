import { TeamDashboard } from "../components"

export default function TeamCreationPage() {
  return (
    <div className="h-[640px] px-3 sm:px-5 flex items-center justify-center">
      <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500/[.2] z-30 bg-clip-padding backdrop-filter backdrop-blur-sm text-white py-4 rounded-lg">
        <TeamDashboard />
      </div>
    </div>
  )
}
