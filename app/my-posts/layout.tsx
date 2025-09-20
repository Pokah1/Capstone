import SideNav from "@/components/sideNav/sideNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Fixed width sidebar */}
      <aside className="w-54 shrink-0 relative z-50">
  <SideNav />
</aside>


      {/* Main content takes remaining space */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}