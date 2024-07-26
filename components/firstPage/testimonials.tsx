'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/components/firstPage/testimonials.module.css';

interface TestimonialProps {
  testimonials: { name: string; content: string }[];
}

const Testimonial: React.FC<TestimonialProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000); // Change testimonial every 40 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className={styles.testimonial}>
       <h2 className={styles.title}>Testimonies</h2>
      <section className={styles.wrapper}>
       
        {testimonials.map((testimonial, index) => (
          <div key={index}
           className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}>
            <blockquote className={styles.quote}>{testimonial.content}</blockquote>
            <cite className={styles.name}>{testimonial.name}</cite>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Testimonial;