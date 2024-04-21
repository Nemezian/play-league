import { TeamManagement } from "../components"

export default function TeamManagementPage() {
  return (
    <div className="h-[700px] md:h-[640px] md px-3 sm:px-5 flex items-center justify-center ">
      <div className=" h-[600px] md:h-[540px]  my-auto w-full lg:w-2/3 px-3 bg-gray-500/[.2] bg-clip-padding backdrop-filter backdrop-blur-sm text-white py-4 rounded-lg">
        <TeamManagement />
      </div>
    </div>
  )
}
