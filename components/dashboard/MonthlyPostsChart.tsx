"use client";

import React, { useEffect, useState } from "react";
import BarChart from "@/components/charts/barChart";
import { createClient } from "@/utils/supabase/client";
import { BarChart3 } from "lucide-react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

const MonthlyPostsChart = () => {
  const [barData, setBarData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Monthly Posts",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false as const, // allow custom height
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#e5e7eb" }, // gray-200
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        ticks: { color: "#e5e7eb" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#f3f4f6" }, // gray-100
      },
    },
  };

  const supabase = createClient();

  useEffect(() => {
    const fetchPostCounts = async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("created_at");

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      const labels: string[] = [];
      const monthlyCounts: Record<string, number> = {};
      const now = new Date();

      // last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        labels.push(label);
        monthlyCounts[label] = 0;
      }

      posts.forEach((post) => {
        const d = new Date(post.created_at);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (monthlyCounts[label] !== undefined) {
          monthlyCounts[label]++;
        }
      });

      setBarData({
        labels,
        datasets: [
          {
            label: "Monthly Posts",
            data: labels.map((label) => monthlyCounts[label]),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchPostCounts();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center w-full bg-[#0f152b] border border-gray-700 rounded-lg p-5 shadow-md">
      <h2 className="flex items-center gap-2 text-lg md:text-xl font-bold text-white mb-3">
        <BarChart3 className="w-5 h-5 text-yellow-400" />
        Monthly Posts
      </h2>

      {/* 👇 give chart container a fixed height */}
      <div className="w-full h-[300px] md:h-[400px]">
        <BarChart data={barData} options={options} />
      </div>
      <p className="text-sm text-gray-400 mt-3 text-center max-w-md">
        Tracks how many posts were created each month. Growth here means the
        community is getting more active.
      </p>
    </div>
  );
};

export default MonthlyPostsChart;
