"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthWrapper from "@/components/AuthWrapper";
import FooterBottom from "@/components/firstPage/footerBottom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContentAnalytics from "@/components/dashboard/ContentAnalytics";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SearchComponent from "@/components/dashboard/Search";
import PersonalizedFeed from "@/components/dashboard/PersonalizedFeed";
import DiscoverSection from "@/components/dashboard/DiscoverSection";
import { fetchAnalyticsData } from "@/utils/analyticsService";
import { Sun, Moon, Sunrise, Sunset, icons } from "lucide-react";
import { text } from "stream/consumers";



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

  const getGreeting = () => {
  const hours = new Date().getHours();
   
    return hours < 12
    ? {text: "Good Morning", icon: <Sun className="w-4 h-4 text-yellow-400 mr-1"/>}
    : hours < 17
    ? { text: "Good Afternoon!", icon: <Sunset className="w-4 h-4 text-orange-400 mr-1" /> }
    : { text: "Good Evening!", icon: <Moon className="w-4 h-4 text-blue-400 mr-1" /> };
  };

  return (
    <AuthWrapper>
      <div className="max-w-full overflow-hidden">
      <DashboardHeader greeting={getGreeting()} />
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
      <FooterBottom  className="text-white"/>
    </div>
    </AuthWrapper>
  );
}
