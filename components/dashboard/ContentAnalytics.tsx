interface ContentAnalyticsProps {
  analyticsData: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    conversionRate: number;
  };
}

export default function ContentAnalytics({ analyticsData }: ContentAnalyticsProps) {
  const stats = [
    { label: "Posts", value: analyticsData.totalPosts },
    { label: "Likes", value: analyticsData.totalLikes },
    { label: "Comments", value: analyticsData.totalComments },
    { label: "Conversion", value: `${analyticsData.conversionRate.toFixed(0)}%` },
  ];

  return (
    <section className="border rounded-lg p-4 bg-gray-800">
      <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-white">
        Content Analytics
      </h2>
      <p className="text-base md:text-sm text-gray-300 mb-4 font-poppins">
        Insights into content performance and audience.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <article key={i} className="bg-gray-700 rounded-lg p-4 flex flex-col items-start gap-2">
            <div className="text-2xl md:text-3xl font-playfair font-bold text-white">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-gray-400 font-poppins">{stat.label}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
