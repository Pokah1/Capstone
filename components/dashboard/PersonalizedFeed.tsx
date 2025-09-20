import Link from "next/link";

export default function PersonalizedFeed() {
  const feedItems = [
    {
      title: "Building Scalable Web Applications with Next.js",
      author: "Jane Doe",
      time: "2 hours ago",
      link: "/dashboard",
      description: "Learn the best practices and strategies to build scalable web applications using Next.js and modern technologies.",
    },
    {
      title: "Design Trends of 2024: What's Coming Next?",
      author: "John Smith",
      time: "5 hours ago",
      link: "/dashboard",
      description: "Explore the top design trends expected to dominate in 2024. From minimalism to bold typography, here's what's coming next.",
    },
    {
      title: "Boost Your Productivity with AI Tools",
      author: "Emily Johnson",
      time: "8 hours ago",
      link: "/dashboard",
      description: "Discover the latest AI tools designed to enhance your productivity and streamline your workflows.",
    },
  ];

  return (
    <section className="border rounded-lg p-4 bg-gray-800">
      <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-white">
        Personalized Feed
      </h2>
      <p className="text-base md:text-sm text-gray-400 mb-4 font-poppins">
        Catch up on personalized updates and insights.
      </p>
      <div className="space-y-6">
        {feedItems.map((item, i) => (
          <article key={i} className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-600" />
            <div>
              <h4 className="font-playfair text-white text-sm md:text-base hover:text-accent hover:underline">
                <Link href={item.link}>{item.title}</Link>
              </h4>
              <p className="text-xs md:text-sm text-gray-400">{item.author} • {item.time}</p>
              <p className="text-base md:text-sm text-gray-300 line-clamp-2 font-poppins">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
