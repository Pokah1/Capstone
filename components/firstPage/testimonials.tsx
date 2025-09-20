'use client'
import React, { useEffect, useState } from 'react';

interface TestimonialProps {
  testimonials: { name: string; content: string }[];
}

const Testimonial: React.FC<TestimonialProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // every 5s

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className="flex flex-col items-center justify-center text-center p-8 bg-gray-100 rounded-lg shadow-md max-w-xl mx-auto w-full overflow-hidden relative">
      <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-800 mb-6">
        Testimonies
      </h2>

      <section className="relative w-full h-48 flex items-center justify-center">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-1000 ease-in-out
              ${index === currentIndex ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full'}
            `}
          >
            <blockquote className="text-lg md:text-xl font-poppins text-gray-700 transition-opacity duration-1000">
              {testimonial.content}
            </blockquote>
            <cite className="mt-3 text-base font-semibold font-poppins text-gray-900 transition-opacity duration-1000">
              – {testimonial.name}
            </cite>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Testimonial;
