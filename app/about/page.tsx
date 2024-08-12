// components/AboutPage.js
"use client";
import Link from "next/link";
import { JSX, SVGProps, useEffect, useState , useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import ProfileIcon from '@/app/assets/profile-pic.jpg';
import FooterBottom from "@/components/firstPage/footerBottom";
import logoIcon from '@/app/assets/logo.png'

const supabase = createClient();



//keyframes using Tailwind CSS 
const slideInKeyframes = {
  transform: "translateX(0)",
  opacity: 1,
  transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
}

const AboutPage = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const imageRefs = useRef<HTMLDivElement[]>([]);

   useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
    }
    checkUser();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("style", "transform: translateX(0); opacity: 1;");
          observer.unobserve(entry.target);
        }
      });
    });

    imageRefs.current.forEach((image) => {
      observer.observe(image);
    });

    return () => observer.disconnect();
  }, []);






  const CheckIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  return (
    <div style={{ backgroundColor: '#0f152b' }} className="flex flex-col min-h-screen">
    <div className="flex justify-between items-center mt-3 px-4">
  <div className="flex items-center">
    <Image src={logoIcon} alt="logo" width={100} height={100} className="ml-8"/>
  </div>
  <Link
    href={isSignedIn ? '/dashboard' : '/'}
    className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:pointer-events-none disabled:opacity-50"
  >
    {isSignedIn ? 'Dashboard' : 'Home'}
  </Link>
</div>

      <section className="w-full pt-12 md:pt-24 lg:pt-32">
        <div className="container mx-auto space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] text-white">
                Crafting Innovative Software Solutions
              </h1>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                At Chatter, we are passionate about creating cutting-edge solutions that empower writers and transform industries. Join us on our mission to push the boundaries of what's possible.
              </p>
              <Link
                href="#"
                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Our Mission</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Empowering Writers Through Innovation
              </h2>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed">
                Our mission is to develop cutting-edge software solutions that help our clients achieve their goals and stay ahead of the curve. We are driven by a passion for innovation and a commitment to excellence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Our Values</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Guiding Principles for Success
              </h2>
              <ul className="grid gap-2 text-gray-700">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Integrity: We are committed to ethical and transparent practices.
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Innovation: We constantly strive to push the boundaries of what's possible.
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Collaboration: We believe in the power of teamwork and partnership.
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Customer-Centricity: We put the needs of our clients at the forefront of everything we do.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-4 text-center">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Our Team</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Meet the Experts Behind Our Success
            </h2>
            <p className="mx-auto max-w-[700px] text-white md:text-xl/relaxed ">
              Our talented team of developers, designers, and strategists work tirelessly to deliver exceptional results for our clients.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {['Odokwo Edikan', 'Ezekwe Nelson', 'Odokwo Edikan', 'Aniebiet Eyo'].map((name, index) => (
              <div key={index} className="flex flex-col items-center justify-center space-y-2">
                <div className="w-24 h-24 rounded-full bg-gray-300">
                  <Image src={ProfileIcon} alt={`${name} profile picture`} width={100} height={100} className="rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-50">{name}</h3>
                  <p className="text-sm text-gray-500">{index === 0 ? 'CEO' : index === 1 ? 'CTO' : index === 2 ? 'Lead Developer' : 'UI/UX Designer'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FooterBottom className="text-white -mt-5 mb-4" />
    </div>
  );
};

export default AboutPage;
