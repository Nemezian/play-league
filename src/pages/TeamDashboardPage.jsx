import { TeamDashboard } from "../components"

export default function TeamDashboardPage() {
  return (
    <div className="h-[640px] px-3 sm:px-5 flex items-center justify-center">
      <div className="w-full sm:w-1/2 lg:w-2/3 px-6">
        <TeamDashboard />
      </div>
    </div>
  )
}
