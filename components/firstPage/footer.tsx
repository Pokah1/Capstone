"use client";
import React, { FormEvent } from "react";
import Link from "next/link";
import LinkedInIcon from "@/app/assets/linkedin.svg";
import TwitterIcon from "@/app/assets/twitter.svg";
import GithubIcon from "@/app/assets/github.svg";
import Testimonial from "./testimonials";
import FooterBottom from "./footerBottom";

const socialLinks = [
  { href: "https://github.com/Pokah1", Icon: GithubIcon, alt: "Github" },
  { href: "https://x.com/sir_pokah?s=21", Icon: TwitterIcon, alt: "Twitter" },
  {
    href: "https://www.linkedin.com/in/edikan-odokwo-7497b3269",
    Icon: LinkedInIcon,
    alt: "LinkedIn",
  },
];

const Footer: React.FC = () => {
  const testimonials = [
    {
      name: "Emma Johnson, Writer",
      content: "Chatter has been a game-changer for me as a writer...",
    },
    {
      name: "Michael Lee, Reader",
      content: "Discovering Chatter was a breath of fresh air...",
    },
    {
      name: "Odokwo Edikan, Writer",
      content: "It's become my go-to platform for quality content...",
    },
    {
      name: "Samuel Umoh, Reader",
      content: "This is quite a phenomenal project.",
    },
    {
      name: "Lisa Williams, Editor",
      content: "I've been using Chatter to engage with my audience...",
    },
    {
      name: "Chinonso Okafor, Author",
      content:
        "Chatter connects me with readers who truly appreciate African literature.",
    },
    {
      name: "Amina Yusuf, Poet",
      content:
        "I’ve found an incredible community here that inspires my creative process.",
    },
    {
      name: "Kwame Mensah, Reader",
      content: "It feels like home for African voices and fresh perspectives.",
    },
    {
      name: "Ngozi Eze, Editor",
      content: "Finally, a space where diverse stories can shine and grow.",
    },
    {
      name: "Tunde Balogun, Storyteller",
      content:
        "Chatter gave me the confidence to share my stories with the world.",
    },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    alert(`Subscribed: ${email}`);
    form.reset();
  };

  return (
    <footer className="bg-white/80 w-full flex flex-col items-center text-black font-poppins py-12 px-4 sm:px-6 lg:px-16">
      <div className="w-full max-w-6xl flex flex-col gap-12">
        {/* Grid Layout for Links & Social */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-playfair font-semibold mb-4">
              Quick Links
            </h2>
            <ul className="flex flex-col gap-2">
              {["Home", "About", "Community", "Blog", "Contact Us"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href="/"
                      className="hover:underline font-poppins text-base"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-playfair font-semibold mb-4">
              Follow Us
            </h2>
            <div className="flex gap-4">
              {socialLinks.map(({ href, Icon, alt }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={alt}
                >
                  <Icon className="w-6 h-6 hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-xl font-playfair font-semibold mb-4">
              Newsletter
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="p-2 border border-gray-300 rounded w-full font-poppins text-base"
                required
              />
              <button
                type="submit"
                className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-500 transition-colors font-poppins text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Testimonials */}
        <Testimonial testimonials={testimonials} />

        {/* Footer Bottom */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
