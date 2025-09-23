import Link from "next/link"

export default function DiscoverSection() {
  const discoverItems = [
    {
      title: "The Ultimate Guide to Tailwind CSS",
      author: "Alice Cooper",
      time: "1 day ago",
      link: "/dashboard",
      description: "An in-depth guide to mastering Tailwind CSS and building beautiful, responsive designs.",
    },
    {
      title: "Advanced TypeScript Techniques",
      author: "Bob Williams",
      time: "3 days ago",
      link: "/dashboard",
      description: "Explore advanced TypeScript features and techniques to write better and more maintainable code.",
    },
    {
      title: "How to Build a Modern Blog with Next.js",
      author: "Sarah Brown",
      time: "1 week ago",
      link: "/dashboard",
      description: "Step-by-step tutorial on building a modern, fast, and scalable blog using Next.js.",
    },
  ]

  return (
    <section className="border rounded-xl p-4 sm:p-6 bg-gray-800 shadow-lg">
      {/* Section Header */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold mb-2 text-white">
        Discover
      </h2>
      <p className="text-sm sm:text-base text-gray-400 mb-4 font-poppins">
        Discover new content and popular posts.
      </p>

      {/* Items */}
      <div className="space-y-5">
        {discoverItems.map((item, i) => (
          <article
            key={i}
            className="flex items-start gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-700/50 transition"
          >
            {/* Avatar / Thumbnail */}
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-600" />

            {/* Text */}
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
