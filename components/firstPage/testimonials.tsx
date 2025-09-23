"use client";
import React, { useEffect, useState } from "react";

interface TestimonialProps {
  testimonials: { name: string; content: string }[];
}

const Testimonial: React.FC<TestimonialProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-slate-300 rounded-xl shadow-lg flex flex-col items-center text-center relative overflow-hidden">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-gray-800 mb-6 sm:mb-8">
        Testimonies
      </h2>

      {testimonials.map((t, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 px-4 sm:px-6 transition-all duration-1000 ease-in-out ${
            idx === currentIndex
              ? "opacity-100 translate-x-0 relative"
              : "opacity-0 translate-x-full"
          }`}
        >
          <blockquote className="text-base sm:text-lg md:text-xl font-poppins text-gray-700 leading-relaxed">
            {t.content}
          </blockquote>
          <cite className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-poppins font-semibold text-gray-900 block">
            – {t.name}
          </cite>
        </div>
      ))}
    </section>
  );
};

export default Testimonial;
