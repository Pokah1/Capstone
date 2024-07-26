'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/firstPage/footer.module.css';
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

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.section}>
          <Image src={Logo} alt='company Logo' className={styles.logoIcon} priority/>

          <div className={styles.flexContainer}>
            {/* Quick Links */}
            <div className={styles.column}>
              <h2 className={styles.heading}>Quick Links</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>Home</Link>
                </li>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>About</Link>
                </li>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>Features</Link>
                </li>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>Community</Link>
                </li>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>Blog</Link>
                </li>
                <li className={styles.listItem}>
                  <Link href="/" className={styles.link}>Contact Us</Link>
                </li>
              </ul>
            </div>
            {/* Social Media */}
            <div className={styles.column}>
              <h2 className={styles.heading}>Follow Us</h2>
              <p className={styles.description}>Stay connected with Chatter on social media for the latest updates and engaging content.</p>
              <div className={`${styles.socialIcons} ${styles.slideIn}`}>
                {socialMediaLinks.map((link, index) => (
                  <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.icon}>
                    <link.Icon width={30} height={30} aria-label={link.alt} />
                  </a>
                ))}
              </div>
            </div>
            {/* Newsletter Signup */}
            <div className={styles.column}>
              <h2 className={styles.heading}>Newsletter Signup</h2>
              <p className={styles.description}>Subscribe to our newsletter for the latest updates and stories from Chatter.</p>
              <form action="#" method="POST" className={styles.form}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={styles.input}
                  required
                />
                <button type="submit" className={styles.button}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Testimonial Component */}
          <Testimonial testimonials={testimonials} />
<FooterBottom/>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
