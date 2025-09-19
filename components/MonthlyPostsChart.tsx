'use client';

import React, { useEffect, useState } from 'react';
import BarChart from '@/components/charts/barChart';
import { createClient } from '@/utils/supabase/client';

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
        label: 'Monthly Posts',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchPostCounts = async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('created_at');

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      // Generate last 12 months labels (e.g., Sep 2023 -> Aug 2024)
      const labels: string[] = [];
      const monthlyCounts: Record<string, number> = {};

      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        labels.push(label);
        monthlyCounts[label] = 0;
      }

      // Count posts in those months
      posts.forEach((post) => {
        const d = new Date(post.created_at);
        const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyCounts[label] !== undefined) {
          monthlyCounts[label]++;
        }
      });

      setBarData({
        labels,
        datasets: [
          {
            label: 'Monthly Posts',
            data: labels.map((label) => monthlyCounts[label]),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchPostCounts();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center w-full bg-[#0f152b] border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-white">Monthly Posts</h2>
      <BarChart data={barData} />
      <p className="text-base text-gray-50 mt-2 text-center">
        The Monthly Posts chart illustrates the volume of content created each month. A consistent increase indicates growing user activity and content creation.
      </p>
    </div>
  );
};

export default MonthlyPostsChart;
