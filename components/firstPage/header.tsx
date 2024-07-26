'use client'
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import Logo from '@/app/assets/logo.png'
import styles from '@/components/firstPage/headers.module.css'

const Header = () =>{
    const [text] = useTypewriter({
        words: [
          'Connect with Authors.',
          'Discover Amazing Content.',
          'Bring your Ideas into Reality.',
          'Write, Discover, and Share.',
          'Take your Writings to another level!'
        ],
        loop: 0,
        typeSpeed: 200,
        delaySpeed: 11,
      });
    
      const [showNavbarBackground, setShowNavbarBackground] = useState(false);

      useEffect(() => {
        const handleScroll = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setShowNavbarBackground(scrollTop > 0); // Toggle background based on scroll position
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (


        <main id="root" className={styles.container}>
        <article className={styles.pageContainer}>
        
          <nav  className={`${styles.nav} ${showNavbarBackground ? styles.navBackground : ''}`}>
     
            <Image src={Logo} alt='companyLogo' className={styles.logo}/>
       
         
          <header className={styles.header}>
          </header>
            <ul>
              <li>
                <Link href="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/About" className={styles.link}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/Contact" className={styles.link}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/Contact" className={styles.link}>
                  Support
                </Link>
              </li>
              <button className={styles.signinButton}>
              <Link href={'/login'} className={styles.signup} >
                Sign-Up
              </Link>
              </button>
              
            </ul>
          </nav>
          <section className={styles.section}>
            <div className={styles.title}>
          
             <h1>CHATTER ✍️ {''}</h1>
              <span className={styles.highlight}>{text}   <Cursor cursorStyle = '||' cursorColor='grey' /></span>      
                </div>
            <p>
              Chatter is a platform where writers can connect with authors, share
              their stories, and discover new ideas. Create a unique profile, share
              your writing, and engage with others through thought-provoking
              conversations.
            </p>
            <p>
              Ready to get started?{' '}
              <Link href={'/login'} className={styles.link}>
                Register Now
              </Link>
            </p>
            <p>
              <Link href={'/dashboard'} className={styles.link}>
                View Dashboard
              </Link>
            </p>
          </section>
          
        </article>
  
      </main>
    )
}
export default Header