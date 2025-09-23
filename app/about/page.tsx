'use client';
import Link from "next/link";
import { JSX, SVGProps, useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import CTOIcon from "@/app/assets/profiles/CTO.jpg"
import CEOIcon from "@/app/assets/profiles/CEO.jpg"
import DesignerIcon from "@/app/assets/profiles/Designer.jpg"
import FooterBottom from "@/components/firstPage/footerBottom";
import logoIcon from '@/app/assets/logo.png';

const supabase = createClient();

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
    <div className="flex flex-col min-h-screen bg-[#0f152b]">
      {/* Header Nav */}
      <div className="flex justify-between items-center mt-3 px-4 sm:px-6 md:px-8">
        <div className="flex items-center">
          <Image src={logoIcon} alt="logo" width={80} height={80} />
        </div>
        <Link
          href={isSignedIn ? '/dashboard' : '/'}
          className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm sm:text-base font-poppins text-black shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSignedIn ? 'Dashboard' : 'Home'}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="w-full pt-12 md:pt-24 lg:pt-32 px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-10 xl:space-y-16">
          <div className="grid gap-6 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-tight leading-snug">
                Crafting Innovative Software Solutions
              </h1>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <p className="max-w-[700px] text-white md:text-lg font-poppins leading-relaxed">
                At Chatter, we are passionate about creating cutting-edge solutions that empower writers and transform industries. Join us on our mission to push the boundaries of what's possible.
              </p>
              <Link
                href="#"
                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm sm:text-base font-poppins text-black shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Mission */}
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-poppins">Our Mission</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold tracking-tight">
                Empowering Writers Through Innovation
              </h2>
              <p className="max-w-[600px] text-gray-700 md:text-lg font-poppins leading-relaxed">
                Our mission is to develop cutting-edge software solutions that help our clients achieve their goals and stay ahead of the curve. We are driven by a passion for innovation and a commitment to excellence.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-poppins">Our Values</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold tracking-tight">
                Guiding Principles for Success
              </h2>
              <ul className="grid gap-2 text-gray-700 font-poppins">
                {[
                  "Integrity: We are committed to ethical and transparent practices.",
                  "Innovation: We constantly strive to push the boundaries of what's possible.",
                  "Collaboration: We believe in the power of teamwork and partnership.",
                  "Customer-Centricity: We put the needs of our clients at the forefront of everything we do."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckIcon className="mt-1 h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
     
<section className="w-full py-12 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8">
  <div className="mx-auto max-w-6xl space-y-8 text-center">
    <div className="space-y-2">
      <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-poppins">Our Team</div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white tracking-tight">
        Meet the Experts Behind Our Success
      </h2>
      <p className="mx-auto max-w-[700px] text-white md:text-lg font-poppins leading-relaxed">
        Our talented team of developers, designers, and strategists work tirelessly to deliver exceptional results for our clients.
      </p>
    </div>

    <div className="relative mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
      {[
        { name: 'Aniebiet Eyo', role: 'CTO', image: DesignerIcon },
        { name: 'Odokwo Edikan', role: 'CEO/Developer', image: CEOIcon },
        { name: 'Ezekwe Nelson', role: 'UI/UX Designer', image: CTOIcon },
      ].map((member, index) => (
        <div
          key={index}
          className={`
            flex flex-col items-center space-y-2 px-4 py-6 bg-gray-800 rounded-xl shadow-lg
            hover:scale-105 transition-transform duration-300
            ${index === 1 ? 'sm:translate-y-6' : ''} 
          `}
        >
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-500">
            <Image
              src={member.image}
              alt={`${member.name} profile picture`}
              width={112}
              height={112}
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-playfair text-white">{member.name}</h3>
            <p className="text-sm sm:text-base font-poppins text-gray-300">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

 {/* Footer */}
      <FooterBottom className="text-white" />
    </div>
  );
};

export default AboutPage;
