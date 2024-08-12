'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Modal from '@/components/ModalDisplay';
import FooterBottom from '@/components/firstPage/footerBottom';
import SearchComponent from '@/components/Search';
import BarChart from '@/components/charts/barChart';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [barData, setBarData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Monthly Posts",
        data: [] as number[],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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
    const fetchPostCounts = async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('created_at');

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const startMonth = 8; // August
      const endMonth = 12; // December
      const monthlyCounts = Array(endMonth - startMonth + 1).fill(0);
      const labels = [];

      for (let month = startMonth; month <= endMonth; month++) {
        labels.push(new Date(0, month - 1).toLocaleString('default', { month: 'short' }));
      }

      posts.forEach((post) => {
        const postMonth = new Date(post.created_at).getMonth() + 1; // JavaScript months are 0-based
        if (postMonth >= startMonth && postMonth <= endMonth) {
          monthlyCounts[postMonth - startMonth]++;
        }
      });

      setBarData({
        labels,
        datasets: [
          {
            label: "Monthly Posts",
            data: monthlyCounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchPostCounts();
  }, [supabase]);


  const greetings = () => {
    const hours = new Date().getHours();
    return hours < 12 ? 'Good Morning!' : hours < 17 ? 'Good Afternoon!' : 'Good Evening!';
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col h-full text-white p-2.5 w-[95%] box-border mb-6 mt-9">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex flex-row items-center justify-between -mt-9">
        <div className="flex items-center gap-6">
          {/* Navigation for both mobile and desktop */}
          <nav className="flex items-center gap-6">
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
      <p className='text-center text-lg md:text-xl lg:text-2xl font-semibold text-gray-950'>
  🚀 Exciting Updates Ahead! We're working tirelessly to bring you the next level of Pro Chatter features. Stay tuned for a whole new experience!
</p>
      </Modal>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Sidebar */}
        <div className="col-span-1 md:col-span-2">
          {/* Search Section */}
          <SearchComponent />
          <div className="flex flex-wrap justify-center gap-5">
            <div className="flex-1 min-w-[400px] max-w-[400px] rounded-lg p-5 shadow-md border pb-2 mt-3">
              <h2 className="text-xl font-bold text-white">Monthly Posts</h2>
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
                  <div className
="text-4xl font-bold text-black">234</div>
                  <div className="text-muted-foreground">Likes</div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">78</div>
                  <div className="text-muted-foreground">Comments</div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col items-start gap-2">
                  <div className="text-4xl font-bold text-black">15%</div>
                  <div className="text-muted-foreground">Conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <FooterBottom />
      </footer>
    </div>
  );
};

export default Dashboard;