"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContentAnalytics from "@/components/dashboard/ContentAnalytics";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SearchComponent from "@/components/Search";
import PersonalizedFeed from "@/components/dashboard/PersonalizedFeed";
import DiscoverSection from "@/components/dashboard/DiscoverSection";
import { fetchAnalyticsData } from "@/utils/analyticsService";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
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
      if (!user) window.location.href = "/";
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
    return hours < 12 ? "Good Morning!" : hours < 17 ? "Good Afternoon!" : "Good Evening!";
  };

  return (
    <AuthWrapper>
      <div className="max-w-full overflow-hidden">
        <DashboardHeader greeting={greetings()} />
        <main className="w-full flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <section className="col-span-1 md:col-span-2 space-y-6">
            <SearchComponent />
            <ContentAnalytics analyticsData={analyticsData} />
            <DashboardCharts />
          </section>
          <section className="col-span-1 space-y-6 mt-32">
            <PersonalizedFeed />
            <DiscoverSection />
          </section>
        </main>
        <FooterBottom className="text-white mb-5" />
      </div>
    </AuthWrapper>
  );
}
