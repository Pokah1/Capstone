"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchAnalyticsData } from "@/utils/analyticsService"; 
import Link from "next/link";
import Modal from "@/components/ModalDisplay";
import FooterBottom from "@/components/firstPage/footerBottom";
import SearchComponent from "@/components/Search";
import UserGrowthChart from "@/components/UserGrowthChart";
import MonthlyPostsChart from "@/components/MonthlyPostsChart";
import AuthWrapper from "@/components/AuthWrapper";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    conversionRate: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        window.location.href = "/";
      }
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const getAnalyticsData = async () => {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
    };

    getAnalyticsData();
  }, []);

  const greetings = () => {
    const hours = new Date().getHours();
    return hours < 12
      ? "Good Morning!"
      : hours < 17
      ? "Good Afternoon!"
      : "Good Evening!";
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <AuthWrapper>
      <div className="max-w-full overflow-hidden">
        <div className="flex flex-col h-full text-white p-4 w-full box-border mb-6 mt-9">
          {/* Header */}
          <header className="w-full bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
  <nav className="flex items-center gap-4 flex-1 justify-start md:justify-end">
    <div className="flex items-center gap-4">
      <button className="bg-white text-black py-2 px-1 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white font-bold cursor-none">
        🌄 {greetings()}
      </button>
    </div>
    <div className="flex items-center gap-4 md:ml-auto">
      <Link href="/content">
        <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white font-bold text-sm md:text-base">
          Write ✍️
        </button>
      </Link>
      <Link href="/about">
        <p className="hover:text-accent hover:underline font-bold md:text-base">
          About
        </p>
      </Link>
      <Link href="/profiles">
        <p className="hover:text-accent hover:underline font-bold md:text-base">
          My Posts
        </p>
      </Link>
    </div>
  </nav>
  <div className="flex items-center gap-4">
    <button
      onClick={handleOpenModal}
      className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-red-950 hover:text-white font-bold text-sm md:text-base hidden md:block"
    >
      Upgrade to Pro
    </button>
  </div>
</header>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Upgrade to Pro"
          >
            <p className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-gray-950">
              🚀 Exciting Updates Ahead! We're working tirelessly to bring you the next level of Pro Chatter features. Stay tuned for a whole new experience!
            </p>
          </Modal>

          {/* Main Content */}
          <main className="w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Sidebar */}
            <section className="col-span-1 md:col-span-2 space-y-6">
              <SearchComponent />

              {/* Content Analytics */}
              <section className="border rounded-lg p-4 bg-gray-800">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                  Content Analytics
                </h2>
                <p className="md:text-sm lg:text-base mb-4 text-base text-white">
                  Insights into your content performance and audience.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <article className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                      {analyticsData.totalPosts}
                    </div>
                    <div className="md:text-sm lg:text-base text-gray-400 text-base">
                      Posts
                    </div>
                  </article>
                  <article className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                      {analyticsData.totalLikes}
                    </div>
                    <div className="text-base md:text-sm lg:text-base text-gray-400">
                      Likes
                    </div>
                  </article>
                  <article className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                      {analyticsData.totalComments}
                    </div>
                    <div className="text-base md:text-sm lg:text-base text-gray-400">
                      Comments
                    </div>
                  </article>
                  <article className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                    <div className="text-xl md:text-2xl lg:text-2xl font-bold text-white">
                    {analyticsData.conversionRate.toFixed(0)}%
                    </div>
                    <div className="text-base md:text-sm lg:text-base text-gray-400">
                      Conversion
                    </div>
                  </article>
                </div>
              </section>

              <section className="flex flex-col md:flex-row gap-6">
                <article className="flex-1 flex flex-col items-center space-y-4">
                  <section className="w-full p-5 shadow-md border rounded-lg">
                    <MonthlyPostsChart />
                  </section>
                  <section className="w-full p-5 shadow-md border rounded-lg">
                    <UserGrowthChart />
                  </section>
                </article>
              </section>
            </section>

            
            <section className="col-span-1 space-y-6 mt-32">
              {/* Personalized Feed */}
              <section className="border rounded-lg p-4 bg-gray-800">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-white">
                  Personalized Feed
                </h2>
                <p className="text-base md:text-sm lg:text-base text-gray-400 mb-4">
                  Catch up on personalized updates and insights.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: "Building Scalable Web Applications with Next.js",
                      author: "Jane Doe",
                      time: "2 hours ago",
                      link: "/dashboard",
                      description:
                        "Learn the best practices and strategies to build scalable web applications using Next.js and modern technologies.",
                    },
                    {
                      title: "Design Trends of 2024: What's Coming Next?",
                      author: "John Smith",
                      time: "5 hours ago",
                      link: "/dashboard",
                      description:
                        "Explore the top design trends expected to dominate in 2024. From minimalism to bold typography, here's what's coming next.",
                    },
                    {
                      title: "Boost Your Productivity with AI Tools",
                      author: "Emily Johnson",
                      time: "8 hours ago",
                      link: "/dashboard",
                      description:
                        "Discover the latest AI tools designed to enhance your productivity and streamline your workflows.",
                    },
                  ].map((article, i) => (
                    <article key={i} className="flex items-start gap-4">
                      <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-600" />
                      <div>
                        <h4 className="font-medium text-sm md:text-base text-white">
                          <Link href={article.link}>
                            <p className="hover:text-accent hover:underline">
                              {article.title}
                            </p>
                          </Link>
                        </h4>
                        <p className="text-xs md:text-sm lg:text-base text-gray-400">
                          {article.author} • {article.time}
                        </p>
                        <p className="text-base md:text-sm lg:text-base text-gray-300 line-clamp-2">
                          {article.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>


              {/* Discover Section */}
              <section className="border rounded-lg p-4 bg-gray-800">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-white">
                  Discover
                </h2>
                <p className="text-base md:text-sm lg:text-base text-gray-400 mb-4">
                  Discover new content and popular posts.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: "The Ultimate Guide to Tailwind CSS",
                      author: "Alice Cooper",
                      time: "1 day ago",
                      link: "/dashboard",
                      description:
                        "An in-depth guide to mastering Tailwind CSS and building beautiful, responsive designs.",
                    },
                    {
                      title: "Advanced TypeScript Techniques",
                      author: "Bob Williams",
                      time: "3 days ago",
                      link: "/dashboard",
                      description:
                        "Explore advanced TypeScript features and techniques to write better and more maintainable code.",
                    },
                    {
                      title: "How to Build a Modern Blog with Next.js",
                      author: "Sarah Brown",
                      time: "1 week ago",
                      link:"/dashboard",
                      description:
                        "Step-by-step tutorial on building a modern, fast, and scalable blog using Next.js.",
                    },
                  ].map((discover, i) => (
                    <article key={i} className="flex items-start gap-4">
                      <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-600" />
                      <div>
                        <h4 className="font-medium text-sm md:text-base text-white">
                          <Link href={discover.link}>
                            <p className="hover:text-accent hover:underline">
                              {discover.title}
                            </p>
                          </Link>
                        </h4>
                        <p className="text-xs md:text-sm lg:text-base text-gray-400">
                          {discover.author} • {discover.time}
                        </p>
                        <p className="text-base md:text-sm lg:text-base text-gray-300 line-clamp-2">
                          {discover.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          </main>
        </div>
        <FooterBottom className="text-white mb-5"/>
      </div>
    </AuthWrapper>
  );
};

export default Dashboard;
