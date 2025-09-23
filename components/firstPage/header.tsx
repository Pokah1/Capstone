"use client";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/logo.png";
import { Feather } from "lucide-react";

const Header: React.FC = () => {
  const [text] = useTypewriter({
    words: [
      "Connect with Authors.",
      "Discover Amazing Content.",
      "Bring your Ideas into Reality.",
      "Write, Discover, and Share.",
      "Take your Writings to another level!",
    ],
    loop: 0,
    typeSpeed: 200,
    delaySpeed: 1100,
  });

  const [showNavbarBackground, setShowNavbarBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowNavbarBackground(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="min-h-screen w-full bg-cover bg-center flex flex-col justify-between text-white font-poppins relative"
      style={{ backgroundImage: "url('/assets/background.webp')" }}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 z-50 transition-colors duration-300 ${
          showNavbarBackground ? "bg-[#0c1137]" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Image
            src={Logo}
            alt="Chatter Logo"
            width={120}
            height={40}
            className="w-20 sm:w-24 md:w-28 h-auto"
            priority
          />
          <span className="hidden sm:inline font-playfair text-lg sm:text-xl font-bold">
            CHATTER
          </span>
        </div>

        <ul className="flex items-center space-x-3 sm:space-x-6 text-sm sm:text-base md:text-lg">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/login">
              <button className="ml-2 sm:ml-4 w-[80px] sm:w-[100px] lg:w-[120px] h-8 sm:h-10 lg:h-11 text-sm sm:text-base border border-gray-400 rounded-md hover:bg-white hover:text-black transition-colors duration-200">
                Sign Up
              </button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col justify-center items-start flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 mt-20 sm:mt-28 md:mt-36 lg:mt-32">
        {/* Title */}

        <h1 className="flex items-center gap-2 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-playfair font-bold mb-6">
          CHATTER{" "}
          <Feather className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-yellow-400" />
        </h1>

        {/* Subheading */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl italic text-yellow-400 mb-6">
          {text} <Cursor cursorStyle="||" cursorColor="grey" />
        </h2>

        {/* Description */}
        <p className="mb-6 w-full sm:w-3/4 md:w-2/3 text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[26px] leading-relaxed xl:leading-snug">
          Chatter is a platform where writers can connect with authors, share
          their stories, and discover new ideas. <br />
          <span className="text-yellow-400">Create</span> a unique profile,
          share your writing, and engage with others through thought-provoking
          conversations.
        </p>

        {/* Call to Action */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] mb-6 leading-relaxed xl:leading-snug">
          Ready to get started?{" "}
          <Link
            href="/login"
            className="text-yellow-400 no-underline hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </header>
  );
};

export default Header;
