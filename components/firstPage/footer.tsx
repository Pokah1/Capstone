'use client';
import React, { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/app/assets/logo.png';
import LinkedInIcon from '@/app/assets/linkedin.svg';
import TwitterIcon from '@/app/assets/twitter.svg';
import GithubIcon from '@/public/assets/github.svg';
import Testimonial from '@/components/firstPage/testimonials';
import FooterBottom from './footerBottom';

interface SvgLink {
  href: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

// Define the array of social media links
const socialMediaLinks: SvgLink[] = [
  {
    href: "https://github.com/Pokah1",
    Icon: GithubIcon,
    alt: "Github",
  },
  {
    href: "https://x.com/sir_pokah?s=21",
    Icon: TwitterIcon,
    alt: "Twitter",
  },
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
      content: "Chatter has been a game-changer for me as a writer. The platform's community and support have inspired me to push my creative boundaries and connect with readers globally."
    },
    {
      name: "Michael Lee, Reader",
      content: "Discovering Chatter was a breath of fresh air. I've found a diverse range of stories that resonate deeply with me. It's become my go-to platform for quality content and new literary voices."
    },
    {
      name: "Odokwo Edikan, Writer",
      content: "It's become my go-to platform for quality content and new literary voices."
    },
    {
      name: "Samuel Umoh, Reader",
      content: "This Is quite phenomenal project."
    },
    {
      name: "Lisa Williams, Editor",
      content: "I've been using Chatter to engage with my audience and connect with them. The platform has been a game-changer for me as a writer."
    },
  ];

  const handleEmailSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    alert(`Subscribed: ${email}`);
    form.reset();
  };

  return (
    <footer className="bg-[url('/assets/background.svg')] bg-cover bg-center flex flex-col text-black font-poppins p-4">
  <div className="flex flex-col items-start">
    <section className="w-full max-w-6xl mx-auto p-5">
      <div className="flex justify-start mb-8">
        <Image src={Logo} alt='company Logo' className="w-28 h-auto sm:w-36" priority />
      </div>

      <div className="flex flex-wrap justify-start gap-8 sm:gap-4">
        {/* Quick Links */}
        <div className="min-w-[250px] my-4">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="list-none p-0 w-min">
            <li className="mb-2 text-lg hover:underline ">
              <Link href="/">Home</Link>
            </li>
            <li className="mb-2 text-lg hover:underline">
              <Link href="/about">About</Link>
            </li>
            <li className="mb-2 text-lg hover:underline">
              <Link href="/">Community</Link>
            </li>
            <li className="mb-2 text-lg hover:underline">
              <Link href="/">Blog</Link>
            </li>
            <li className="mb-2 text-lg hover:underline">
              <Link href="/">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Social Media and Newsletter Signup */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Follow Us */}
          <div className="min-w-[250px] my-4">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <p className="mb-4 text-lg">Stay connected with Chatter on social media for the latest updates and engaging content.</p>
            <div className="flex gap-6">
              {/* Social media icons */}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="min-w-[250px] my-4">
            <h2 className="text-xl font-semibold mb-4">Newsletter Signup</h2>
            <p className="mb-4 text-lg">Subscribe to our newsletter for the latest updates and stories from Chatter.</p>
            <form onSubmit={handleEmailSubmission} className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="p-2 rounded border border-gray-300 mb-2 w-full sm:w-[80%] h-10"
                required
              />
              <button type="submit" className="bg-[#2b6cb0] text-white p-2 rounded w-full sm:w-[80%] h-10 text-sm mt-3 hover:bg-stone-950">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Testimonial Component */}
      <Testimonial testimonials={testimonials} />
      <FooterBottom className='text-black' />
    </section>
  </div>
</footer>

  
  );
};

export default Footer;
