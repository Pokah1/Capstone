import Link from "next/link";
import { PenLine } from "lucide-react";

interface DashboardHeaderProps {
  greeting: { text: string; icon: React.ReactNode };
}

export default function DashboardHeader({ greeting }: DashboardHeaderProps) {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Greeting Button */}
      <div className="flex items-center">
        <button className="flex items-center gap-2 bg-white text-black py-2 px-3 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white font-playfair font-bold text-sm sm:text-base">
          {greeting.icon}
          {greeting.text}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-3 sm:gap-4 md:ml-auto flex-wrap">
        <Link href="/content">
          <button className="bg-white text-black py-2 px-3 sm:px-4 rounded-lg border border-gray-300 hover:bg-blue-950 hover:text-white font-poppins font-semibold text-sm md:text-base">
            <PenLine className="inline w-4 h-4 mr-1" />
            Write
          </button>
        </Link>
        <Link href="/about">
          <p className="hover:text-accent hover:underline font-playfair font-semibold text-sm md:text-base">
            About
          </p>
        </Link>
        <Link href="/my-posts">
          <p className="hover:text-accent hover:underline font-playfair font-semibold text-sm md:text-base">
            My Posts
          </p>
        </Link>
      </nav>
    </header>
  );
}
