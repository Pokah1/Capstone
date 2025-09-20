'use client';

import React, { useEffect, useState } from 'react';
import LineChart from '@/components/charts/lineChart';
import { createClient } from '@/utils/supabase/client';

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
    scales: {
      x: {
        display: true,
        grid: { display: false },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: { display: true },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const supabase = createClient();

  useEffect(() => {
    const fetchUserSignups = async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('created_at');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      updateChart(users || []);
    };

    const updateChart = (users: any[]) => {
      const groupedByYear: Record<number, number[]> = {};

      users.forEach(user => {
        const createdAt = new Date(user.created_at);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();

        if (!groupedByYear[year]) {
          groupedByYear[year] = Array(12).fill(0);
        }
        groupedByYear[year][month]++;
      });

      // Assign colors per year so lines are distinct
      const colors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
      ];

      setLineData({
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
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

    // Initial fetch
    fetchUserSignups();

    // Realtime subscription
    const channel = supabase
      .channel('user-growth')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        (payload) => {
          console.log('New user inserted:', payload);
          fetchUserSignups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col items-center w-full bg-[#0f152b] border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-white">User Growth (Multi-Year)</h2>
      <div className="w-full h-[400px]">
        <LineChart data={lineData} options={options} />
      </div>
      <p className="text-base text-gray-50 mt-2 text-center">
        This chart shows the number of new users per month, separated by year.
      </p>
    </div>
  );
};

export default UserGrowthChart;
