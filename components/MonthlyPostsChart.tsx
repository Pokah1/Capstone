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
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Posts',
        data: Array(12).fill(0), // Initialize with 12 zeros for each month
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

      const monthlyCounts = Array(12).fill(0);

      posts.forEach((post) => {
        const postMonth = new Date(post.created_at).getMonth(); // 0 (Jan) to 11 (Dec)
        monthlyCounts[postMonth]++;
      });

      setBarData((prevState) => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: monthlyCounts,
          },
        ],
      }));
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
