import Link from "next/link";

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
  ];

  return (
    <section className="border rounded-lg p-4 bg-gray-800">
      <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-white">Discover</h2>
      <p className="text-base md:text-sm text-gray-400 mb-4 font-poppins">
        Discover new content and popular posts.
      </p>
      <div className="space-y-6">
        {discoverItems.map((item, i) => (
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
