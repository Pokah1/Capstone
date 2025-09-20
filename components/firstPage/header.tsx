"use client";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/logo.png";

const Header = () => {
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
    delaySpeed: 11,
  });

  const [showNavbarBackground, setShowNavbarBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowNavbarBackground(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-start justify-center w-full bg-cover bg-center font-poppins text-white"
      style={{ backgroundImage: "url(/assets/background.jpg)" }}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-4 transition-colors duration-300 z-50 w-full ${
          showNavbarBackground ? "bg-[#0c1137]" : "bg-transparent"
        }`}
      >
        <Image src={Logo} alt="Company Logo" className="w-28 sm:w-36 h-auto" priority />
        <ul className="flex items-center space-x-4 md:space-x-6">
          <li>
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/login">
              <button className="ml-6 w-[100px] h-[40px] border border-gray-400 rounded-md text-white hover:bg-white hover:text-black transition-colors duration-200">
                Sign-Up
              </button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Content */}
      <section className="mt-32 px-4 py-8 w-full ml-8">
        <div className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
          <h1>CHATTER ✍️</h1>
          <span className="block text-[#c5db32] text-xl md:text-2xl lg:text-3xl italic">
            {text}
            <Cursor cursorStyle="||" cursorColor="grey" />
          </span>
        </div>
        <p className="mb-5 text-xl md:text-2xl lg:text-3xl leading-relaxed mt-7 ">
          Chatter is a platform where writers can connect with authors, share their stories, and discover new ideas.
          <br />
          <span className="text-[#c5db32]">Create</span> a unique profile, share your writing, and engage with others through thought-provoking conversations.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl mb-6">
          Ready to get started?{" "}
          <Link href="/login" className="text-[#c5db32] hover:underline">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Header;
