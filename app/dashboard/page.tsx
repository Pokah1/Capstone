'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchAnalyticsData } from '@/utils/analyticsService'; // Adjust the path as necessary
import Link from 'next/link';
import Modal from '@/components/ModalDisplay';
import FooterBottom from '@/components/firstPage/footerBottom';
import SearchComponent from '@/components/Search';
import UserGrowthChart from '@/components/UserGrowthChart';
import MonthlyPostsChart from '@/components/MonthlyPostsChart';
import AuthWrapper from '@/components/AuthWrapper';

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
      const { data: { user } } = await supabase.auth.getUser();
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
    return hours < 12 ? 'Good Morning!' : hours < 17 ? 'Good Afternoon!' : 'Good Evening!';
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <AuthWrapper>
        <div className="flex flex-col h-full text-white p-4 w-full box-border mb-6 mt-9">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            <Link href="/content">
              <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white">
                Write ✍️
              </button>
            </Link>
            <Link href="/about">
              <p className="hover:text-accent hover:underline">About</p>
            </Link>
            <Link href="/profiles">
              <p className="hover:text-accent hover:underline">Personal</p>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white font-bold cursor-none">
              🌄 {greetings()}
            </button>
            <button onClick={handleOpenModal} className="bg-white text-black py-2 px-4 rounded-lg border border-gray-300 hover:bg-red-950 hover:text-white">
              Upgrade to Pro
            </button>
          </div>
        </header>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Upgrade to Pro">
          <p className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-gray-950">
            🚀 Exciting Updates Ahead! We're working tirelessly to bring you the next level of Pro Chatter features. Stay tuned for a whole new experience!
          </p>
        </Modal>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Sidebar */}
          <aside className="col-span-1 md:col-span-2 space-y-6">
            <SearchComponent />
            
            {/* Content Analytics */}
            <section className="border rounded-lg p-4 bg-gray-800">
              <h2 className="text-xl font-bold mb-2">Content Analytics</h2>
              <p className="text-sm text-white mb-4">
                Insights into your content performance and audience.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-2xl font-bold text-white">{analyticsData.totalPosts}</div>
                  <div className="text-gray-400">Posts</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-2xl font-bold text-white">{analyticsData.totalLikes}</div>
                  <div className="text-gray-400">Likes</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-2xl font-bold text-white">{analyticsData.totalComments}</div>
                  <div className="text-gray-400">Comments</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-2xl font-bold text-white">{analyticsData.conversionRate.toFixed(2)}%</div>
                  <div className="text-gray-400">Conversion</div>
                </div>
              </div>
            </section>

            <div className="flex flex-col md:flex-row gap-6">
              <section className="flex-1 flex flex-col items-center space-y-4">
                <article className="w-full p-5 shadow-md border rounded-lg">
                  <MonthlyPostsChart />
                </article>
                <article className="w-full p-5 shadow-md border rounded-lg">
                  <UserGrowthChart />
                </article>
              </section>
            </div>
          </aside>

          {/* Personalized Feed */}
          <aside className="col-span-1 space-y-6 mt-32">
            <section className="border rounded-lg p-4 bg-gray-800">
              <h2 className="text-xl font-bold mb-2">Personalized Feed</h2>
              <p className="text-sm text-gray-400 mb-4">
                Discover new content based on your interests and reading history.
              </p>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-full bg-gray-600" />
                    <div>
                      <h4 className="font-medium">Article Title</h4>
                      <p className="text-gray-400 text-sm">Author Name • 2 hours ago</p>
                      <p className="text-sm line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Discover More */}
            <section className="border rounded-lg p-4 bg-gray-800">
              <h2 className="text-xl font-bold mb-2">Discover More</h2>
              <p className="text-sm text-gray-400 mb-4">
                Browse and filter content by category, author, or search.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
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
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-full bg-gray-600" />
                    <div>
                      <h4 className="font-medium">Article Title</h4>
                      <p className="text-gray-400 text-sm">Author Name • 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </main>

        {/* Footer */}
        <footer>
          <FooterBottom />
        </footer>
      </div>
    </AuthWrapper>
  );
};

export default Dashboard;
