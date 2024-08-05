import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FooterBottom from "@/components/firstPage/footerBottom";
import dynamic from "next/dynamic";

// Dynamically import BarChart as a client-side component
const BarChart = dynamic(() => import("@/components/charts/barChart"), {
  ssr: false,
});


const barData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Monthly Posts",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const Dashboard = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
    return null; // To ensure no further rendering occurs
  }

  return (
    <div className="flex flex-col h-full text-white p-2.5 w-[95%] box-border mb-6">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex flex-col md:flex-row items-center justify-between -mt-9">
        <div className="flex items-center gap-4">
          {/* Navigation for both mobile and desktop */}
          <nav className="flex flex-wrap items-center gap-6 mt-7">
            <Link href="/content">
              <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white">
                Write ✍️
              </button>
            </Link>
            <Link href="/about">
              <p className="hover:text-accent hover:underline">About</p>
            </Link>
            <Link href="/discover">
              <p className="hover:text-accent hover:underline">Discover</p>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-red-950 hover:text-white">
            Upgrade to Pro
          </button>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Sidebar */}
        <div className="col-span-1 md:col-span-2">
          {/* Search Section */}
          <section className="mt-6">
            <h2 className="text-xl font-bold">Search</h2>
            <input
              type="text"
              placeholder="Search content or users..."
              className="mt-2 w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </section>
          <div className="flex flex-wrap justify-center gap-5 ">
            <div className="flex-1 min-w-[400px] max-w-[400px] rounded-lg p-5 shadow-md border pb-2 mt-3">
              <h2 className="text-2xl mb-2 text-white">Monthly Posts</h2>
              {/* Import */}
              <BarChart data={barData} />

              <p className="text-base text-white mt-2">
                The Monthly Posts chart illustrates the volume of content
                created each month. A consistent increase indicates growing user
                activity and content creation.
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Feed */}
        <div className="col-span-1">
          <div className="border rounded-md p-4 mt-28">
            <div className="border-b pb-2">
              <h2 className="text-xl font-bold">Personalized Feed</h2>
              <p className="text-sm text-muted">
                Discover new content based on your interests and reading
                history.
              </p>
            </div>
            <div className="pt-2">
              <div className="grid gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-full bg-muted" />
                    <div>
                      <h4 className="font-medium">Article Title</h4>
                      <p className="text-muted-foreground text-sm">
                        Author Name • 2 hours ago
                      </p>
                      <p className="text-sm line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed euismod, nisl nec ultricies lacus, nisl nec
                        ultricies lacus.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discover More */}
        <div className="col-span-1">
          <div className="border rounded-md p-4">
            <div className="border-b pb-2">
              <h2 className="text-xl font-bold">Discover More</h2>
              <p className="text-sm text-muted">
                Browse and filter content by category, author, or search.
              </p>
            </div>
            <div className="pt-2">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <button className="bg-outline text-sm py-2 px-4 rounded">
                    Technology
                  </button>
                  <button className="bg-outline text-sm py-2 px-4 rounded">
                    Design
                  </button>
                  <button className="bg-outline text-sm py-2 px-4 rounded">
                    Productivity
                  </button>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-full bg-muted" />
                    <div>
                      <h4 className="font-medium">Article Title</h4>
                      <p className="text-muted-foreground text-sm">
                        Author Name • 2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Analytics */}
        <div className="col-span-1 md:col-span-2">
          <div className="border rounded-md p-4">
            <div className="border-b pb-2">
              <h2 className="text-xl font-bold">Content Analytics</h2>
              <p className="text-sm text-muted">
                Insights into your content performance and audience.
              </p>
            </div>
            <div className="pt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">1.2K</div>
                  <div className="text-muted-foreground">Views</div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">234</div>
                  <div className="text-muted-foreground">Likes</div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">78</div>
                  <div className="text-muted-foreground">Comments</div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">15%</div>
                  <div className="text-muted-foreground">Engagement Rate</div>
                </div>
              </div>
              <hr className="my-6" />
              <div className="grid gap-4">
                <div>
                  <h4 className="text-lg font-medium">
                    Top Performing Content
                  </h4>
                  <div className="grid gap-4 mt-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="shrink-0 w-16 h-16 rounded-full bg-muted" />
                        <div>
                          <h5 className="font-medium">Article Title</h5>
                          <p className="text-muted-foreground text-sm">
                            1.2K views • 234 likes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium">Audience Insights</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                      <div className="text-4xl font-bold text-black">45%</div>
                      <div className="text-muted-foreground">Female</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                      <div className="text-4xl font-bold text-black">55%</div>
                      <div className="text-muted-foreground">Male</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                      <div className="text-4xl font-bold text-black">18-24</div>
                      <div className="text-muted-foreground">Age Group</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterBottom className="text-white " />
    </div>
  );
};

export default Dashboard;
