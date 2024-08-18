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
          className={`w-full flex items-center justify-between px-4 md:px-8 py-4 fixed top-0 left-0 right-0 transition-colors duration-300 ${
            showNavbarBackground ? "bg-[#0c1137]" : "bg-transparent"
          }`}
        >
          <Image src={Logo} alt='company Logo' className="w-28 h-auto sm:w-36 " priority />

          {/* Navigation Links */}
          <ul className="flex items-center space-x-4 md:space-x-6 mt-4">
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
              <button className="bg-transparent border border-gray-400 rounded-[5px] cursor-pointer w-[100px] h-[40px] transition-colors duration-200 hover:bg-white hover:text-black ml-6">
                <Link href="/login" className="text-inherit no-underline text-lg">
                  Sign-Up
                </Link>
              </button>
            </li>
          </ul>
        </nav>

        <section className="mt-32 mx-4 md:mx-12 my-8 p-5 text-left px-4">
          <div className="w-full text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-8">
            <h1>CHATTER ✍️ {""}</h1>
            <span className="block text-[#c5db32] text-xl md:text-2xl lg:text-3xl italic">
              {text}
              <Cursor cursorStyle="||" cursorColor="grey" />
            </span>
          </div>
          <p className="mb-5 w-full md:w-1/2 text-xl md:text-2xl lg:text-3xl mt-7 leading-9">
            Chatter is a platform where writers can connect with authors, share
            their stories, and discover new ideas. <br />
            <span className=" text-[#c5db32] ">Create</span> a unique profile,
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
