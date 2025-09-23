import UserGrowthChart from "./UserGrowthChart"
import MonthlyPostsChart from "./MonthlyPostsChart"

export default function DashboardCharts() {
  return (
    <section className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
      {/* Monthly Posts */}
      <div className="flex-1 p-5 shadow-md border border-gray-700 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
        <MonthlyPostsChart />
      </div>

      {/* User Growth */}
      <div className="flex-1 p-5 shadow-md border border-gray-700 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
        <UserGrowthChart />
      </div>
    </section>
  )
}
