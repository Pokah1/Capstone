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
    datasets: [
      {
        label: 'User Growth',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 4,
        fill: false,
        tension: 0.1,
      },
    ],
  });

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

      const monthlyUserData = Array(12).fill(0);
      users.forEach(user => {
        const month = new Date(user.created_at).getMonth(); // Get the month index (0-11)
        monthlyUserData[month]++;
      });
     


      setLineData({
        labels: [
          'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July',
          'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
        ],
        datasets: [
          {
            label: 'Monthly User Signups',
            data: monthlyUserData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
          },
        ],
      });
    };

    fetchUserSignups();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center w-full bg-[#0f152b] border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-white">User Growth</h2>
      <div className="w-full">
        <LineChart data={lineData} />
      </div>
      <p className="text-base text-gray-50 mt-2 text-center">
        The User Growth chart highlights the increase in user registrations. Steady growth indicates positive user acquisition trends.
      </p>
    </div>
  );
};

export default UserGrowthChart;
