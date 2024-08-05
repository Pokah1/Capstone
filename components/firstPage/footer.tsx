'use client';
import React, { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/app/assets/logo.png';
import LinkedInIcon from '@/app/assets/linkedin.svg';
import TwitterIcon from '@/app/assets/twitter.svg';
import FacebookIcon from '@/app/assets/facebook.svg';
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
    href: "https://facebook.com",
    Icon: FacebookIcon,
    alt: "Facebook",
  },
  {
    href: "https://twitter.com",
    Icon: TwitterIcon,
    alt: "Twitter",
  },
  {
    href: "https://linkedin.com",
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
    console.log(`Subscribed: ${email}`);
    // Optionally, you can clear the form or give feedback to the user
    form.reset();
  };

  return (
    <footer className="bg-[url('/assets/background.svg')] bg-cover bg-center min-h-screen flex flex-col text-black font-poppins p-4">
      <div className="flex flex-col items-center">
        <section className="my-8 mx-12 p-5">
          <Image src={Logo} alt='company Logo' className="w-[11%] h-[11%]" priority/>

          <div className="flex flex-wrap justify-around mt-8">
            {/* Quick Links */}
            <div className="min-w-[250px] my-4">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <ul className="list-none p-0">
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">Home</Link>
                </li>
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">About</Link>
                </li>
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">Features</Link>
                </li>
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">Community</Link>
                </li>
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">Blog</Link>
                </li>
                <li className="mb-2 text-lg">
                  <Link href="/" className="no-underline">Contact Us</Link>
                </li>
              </ul>
            </div>
            {/* Social Media */}
            <div className="min-w-[250px] my-4">
              <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
              <p className="mb-4 text-lg">Stay connected with Chatter on social media for the latest updates and engaging content.</p>
              <div className="flex gap-6">
                {socialMediaLinks.map((link, index) => (
                  <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="w-11 h-11">
                    <link.Icon width={30} height={30} aria-label={link.alt} />
                  </a>
                ))}
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
                  className="p-2 rounded border border-gray-300 mb-2 w-[80%] h-10"
                  required
                />
                <button type="submit" className="bg-[#2b6cb0] text-white p-2 rounded w-[80%] h-10 text-sm mt-3">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Testimonial Component */}
          <Testimonial testimonials={testimonials} />
          <FooterBottom className='text-red-600'/>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
