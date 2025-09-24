'use client';

import React, { useEffect, useState } from 'react';
import LineChart from '@/components/charts/lineChart';
import { createClient } from '@/utils/supabase/client';
import { TrendingUp } from "lucide-react"; 


interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

const UserGrowthChart = () => {
  const [lineData, setLineData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false as const, // allow container height
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: '#e5e7eb' }, // gray-200
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#e5e7eb' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#f3f4f6' }, // gray-100
      },
    },
  };

  const supabase = createClient();

  useEffect(() => {
    const fetchUserSignups = async () => {
      const { data: users, error } = await supabase.from('users').select('created_at');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      updateChart(users || []);
    };

    const updateChart = (users: any[]) => {
      const groupedByYear: Record<number, number[]> = {};

      users.forEach((user) => {
        const createdAt = new Date(user.created_at);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();

        if (!groupedByYear[year]) {
          groupedByYear[year] = Array(12).fill(0);
        }
        groupedByYear[year][month]++;
      });

      const colors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
      ];

      setLineData({
        labels: [
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec',
        ],
        datasets: Object.entries(groupedByYear).map(([year, months], index) => ({
          label: `Signups ${year}`,
          data: months,
          borderColor: colors[index % colors.length],
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        })),
      });
    };

    fetchUserSignups();

    const channel = supabase
      .channel('user-growth')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        () => fetchUserSignups()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col items-center w-full bg-[#0f152b] border border-gray-700 rounded-lg p-5 shadow-md">
      <h2 className="flex items-center gap-2 text-lg md:text-xl font-bold text-white mb-3">
  <TrendingUp className="w-5 h-5 text-yellow-400" />
  User Growth (Multi-Year)
</h2>
      {/* 👇 responsive chart container */}
      <div className="w-full h-[300px] md:h-[400px]">
        <LineChart data={lineData} options={options} />
      </div>
      <p className="text-sm text-gray-400 mt-3 text-center max-w-md">
        This chart shows the number of new users per month, separated by year.
      </p>
    </div>
  );
};

export default UserGrowthChart;
