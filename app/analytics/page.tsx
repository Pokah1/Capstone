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

const Analytics = () => {
  const [lineData, setLineData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'User Growth',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  });

  const supabase = createClient();

  useEffect(() => {
    fetchUserSignups();
  }, []);

  const fetchUserSignups = async () => {
    const { data: users, error } = await supabase
      .from('users') // Ensure 'auth.users' is the correct reference
      .select('created_at');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    // Prepare data for the line chart
    const monthlyUserData = Array(12).fill(0);
    users.forEach(user => {
      const month = new Date(user.created_at).getMonth(); // 0 is January, 11 is December
      monthlyUserData[month]++;
    });

    setLineData({
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
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

  return (
    <div className="p-5 text-center">
      <h1 className="text-4xl mb-5 text-white">User Growth Analytics</h1>
      <div className="mb-5 text-lg text-gray-50">
        <p>This chart shows the number of new user signups on a monthly basis.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        <div style={{ backgroundColor: '#0f152b' }} className="flex-1 min-w-[300px] max-w-[400px] border border-gray-300 rounded-lg p-5 shadow-md">
          <h2 className="text-2xl mb-2 text-white">User Growth</h2>
          <LineChart data={lineData} />
          <p className="text-base text-gray-50 mt-2">The User Growth chart highlights the increase in user registrations. Steady growth indicates positive user acquisition trends.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
