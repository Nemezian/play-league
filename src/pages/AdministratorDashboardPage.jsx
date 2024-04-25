import { AdministratorDashboard } from "../components"

export default function AdministratorDashboardPage() {
  return (
    <div className="h-[760px] md:h-[700px] md px-3 sm:px-5 flex items-center justify-center ">
      <div className=" h-[660px] md:h-[600px]  my-auto w-full lg:w-2/3 px-3 bg-gray-500/[.2] bg-clip-padding backdrop-filter backdrop-blur-sm text-white py-4 rounded-lg">
        <AdministratorDashboard />
      </div>
    </div>
  )
}
