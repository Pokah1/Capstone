import UserGrowthChart from "@/components/UserGrowthChart";
import MonthlyPostsChart from "@/components/MonthlyPostsChart";

export default function DashboardCharts() {
  return (
    <section className="flex flex-col md:flex-row gap-6 mt-6">
      <div className="flex-1 p-5 shadow-md border rounded-lg bg-gray-800">
        <MonthlyPostsChart />
      </div>
      <div className="flex-1 p-5 shadow-md border rounded-lg bg-gray-800">
        <UserGrowthChart />
      </div>
    </section>
  );
}
