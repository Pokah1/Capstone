// app/analytics/analytics.tsx
'use client'
import React from 'react';
import BarChart from '@/components/charts/barChart';
import LineChart from '@/components/charts//lineChart';
import PieChart from '@/components/charts/pieChart';




const barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Monthly Posts',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'User Growth',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    },
  ],
};

const pieData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};

const Analytics = () => {
  return (
    <div className="p-5 text-center">
  <h1 className="text-4xl mb-5 text-black"  >Analytics Dashboard</h1>
  <div className="mb-5 text-lg text-gray-600">
    <p>This dashboard provides an overview of user engagement, post distribution, and growth metrics over the past six months.</p>
  </div>
  <div className="flex flex-wrap justify-center gap-5">
    <div className="flex-1 min-w-[300px] max-w-[400px] bg-gray-200 border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-black" >Monthly Posts</h2>
      <BarChart data={barData} />
      <p className="text-base text-gray-500 mt-2">The Monthly Posts chart illustrates the volume of content created each month. A consistent increase indicates growing user activity and content creation.</p>
    </div>
    <div className="flex-1 min-w-[300px] max-w-[400px] bg-gray-200 border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-black" >User Growth</h2>
      <LineChart data={lineData} />
      <p className="text-base text-gray-500 mt-2">The User Growth chart highlights the increase in user registrations. Steady growth is a positive indicator of the platform popularity and user acquisition efforts.</p>
    </div>
    <div className="flex-1 min-w-[300px] max-w-[400px] bg-gray-200 border border-gray-300 rounded-lg p-5 shadow-md">
      <h2 className="text-2xl mb-2 text-black">Post Distribution</h2>
      <PieChart data={pieData} />
      <p className="text-base text-gray-500 mt-2">The Post Distribution chart shows the breakdown of various content categories. Understanding the distribution helps in identifying popular content types and areas for improvement.</p>
    </div>
  </div>
</div>
  );
};

export default Analytics;