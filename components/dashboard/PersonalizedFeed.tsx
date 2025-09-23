import Link from "next/link"

export default function PersonalizedFeed() {
  const feedItems = [
    {
      title: "Building Scalable Web Applications with Next.js",
      author: "Jane Doe",
      time: "2 hours ago",
      link: "/dashboard",
      description:
        "Learn the best practices and strategies to build scalable web applications using Next.js and modern technologies.",
    },
    {
      title: "Design Trends of 2024: What's Coming Next?",
      author: "John Smith",
      time: "5 hours ago",
      link: "/dashboard",
      description:
        "Explore the top design trends expected to dominate in 2024. From minimalism to bold typography, here's what's coming next.",
    },
    {
      title: "Boost Your Productivity with AI Tools",
      author: "Emily Johnson",
      time: "8 hours ago",
      link: "/dashboard",
      description:
        "Discover the latest AI tools designed to enhance your productivity and streamline your workflows.",
    },
  ]

  return (
    <section className="border rounded-xl p-4 sm:p-6 bg-gray-800 shadow-lg">
      {/* Section Header */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold mb-2 text-white">
        Personalized Feed
      </h2>
      <p className="text-sm sm:text-base text-gray-400 mb-4 font-poppins">
        Catch up on personalized updates and insights.
      </p>

      {/* Feed Items */}
      <div className="space-y-5">
        {feedItems.map((item, i) => (
          <article
            key={i}
            className="flex items-start gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-700/50 transition"
          >
            {/* Avatar / Thumbnail */}
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-600" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-playfair text-white text-sm sm:text-base md:text-lg font-semibold hover:text-accent hover:underline line-clamp-1">
                <Link href={item.link}>{item.title}</Link>
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                {item.author} • {item.time}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 line-clamp-2 font-poppins">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
