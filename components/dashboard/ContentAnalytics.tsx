interface ContentAnalyticsProps {
  analyticsData: {
    totalPosts: number
    totalLikes: number
    totalComments: number
    conversionRate: number
  }
}

export default function ContentAnalytics({ analyticsData }: ContentAnalyticsProps) {
  const stats = [
    { label: "Posts", value: analyticsData.totalPosts },
    { label: "Likes", value: analyticsData.totalLikes },
    { label: "Comments", value: analyticsData.totalComments },
    { label: "Conversion", value: `${analyticsData.conversionRate.toFixed(0)}%` },
  ]

  return (
    <section className="rounded-xl p-5 bg-gray-900 border border-gray-700 shadow-md">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-playfair font-bold text-white">Content Analytics</h2>
        <p className="text-sm sm:text-base text-gray-400 mt-1 font-poppins">
          Insights into total content performance and audience.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <article
            key={i}
            className="bg-gray-800 rounded-lg p-4 flex flex-col items-center sm:items-start text-center sm:text-left hover:bg-gray-700 transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-white">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-poppins">
              {stat.label}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
