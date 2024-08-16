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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowNavbarBackground(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white font-poppins"
      style={{ backgroundImage: "url(/assets/background.jpg)" }}
    >
      <article className="flex flex-col items-center justify-center w-full h-full">
        <nav
          className={`w-full flex justify-between px-8 py-4 fixed top-0 left-0 right-0 transition-colors duration-300 ${
            showNavbarBackground ? "bg-[#0c1137]" : "bg-transparent"
          }`}
        >
          <Image
            src={Logo}
            alt="company Logo"
            className="w-[11%] h-[11%] ml-7"
            priority
          />

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center space-x-6 mt-4">
            <li>
              <Link href="/" className="text-white no-underline hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white no-underline hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/Contact" className="text-white no-underline hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/Contact" className="text-white no-underline hover:underline">
                Support
              </Link>
            </li>
            <li>
              <button className="mt-[-8px] ml-[25px] bg-transparent border border-gray-400 rounded-[5px] cursor-pointer w-[100px] h-[40px] transition-colors duration-200 hover:bg-white hover:text-black">
                <Link href="/login" className="text-inherit no-underline text-lg">
                  Sign-Up
                </Link>
              </button>
            </li>
          </ul>

          {/* Hamburger Icon for Small Screens */}
          <button
            className="text-white block md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center md:hidden">
            <ul className="flex flex-col items-center space-y-6">
              <li>
                <Link href="/" className="text-white no-underline hover:underline text-2xl">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white no-underline hover:underline text-2xl">
                  About
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="text-white no-underline hover:underline text-2xl">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="text-white no-underline hover:underline text-2xl">
                  Support
                </Link>
              </li>
              <li>
                <button className="mt-[-8px] bg-transparent border border-gray-400 rounded-[5px] cursor-pointer w-[120px] h-[40px] transition-colors duration-200 hover:bg-white hover:text-black">
                  <Link href="/login" className="text-inherit no-underline text-xl">
                    Sign-Up
                  </Link>
                </button>
              </li>
            </ul>
            <button
              className="absolute top-4 right-4 text-white focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        )}

        <section className="mt-32 mx-12 my-8 p-5 text-left px-4">
          <div className="w-full text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-8">
            <h1>CHATTER ✍️ {""}</h1>
            <span className="block text-[#c5db32] text-2xl md:text-3xl lg:text-4xl italic">
              {text}
              <Cursor cursorStyle="||" cursorColor="grey" />
            </span>
          </div>
          <p className="mb-5 w-1/2 text-2xl text-white mt-7 leading-9">
            Chatter is a platform where writers can connect with authors, share
            their stories, and discover new ideas. Create a unique profile,
            share your writing, and engage with others through thought-provoking
            conversations.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            Ready to get started?{" "}
            <Link href="/login" className="text-[#c5db32] no-underline hover:underline">
              Sign Up
            </Link>
          </p>
        </section>
      </article>
    </main>
  );
};

export default Header;
