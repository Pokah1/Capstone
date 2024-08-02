'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import SideNav from "@/components/sideNav/sideNav"; 
import styles from "@/clientWrapper.module.css";

const excludedPaths = ['/', '/login', '/content', '/not-found']; 

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showSideNav, setShowSideNav] = useState(false); 
    const [sideNavWidth, setSideNavWidth] = useState(80); 
    const [isPathChecked, setIsPathChecked] = useState(false);

    const sideNavRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
       
        const currentPath = pathname === '/' ? pathname : pathname.replace(/\/$/, ''); // Handle root path separately
        const shouldShowSideNav = !excludedPaths.includes(currentPath);
        setShowSideNav(shouldShowSideNav);
        setIsPathChecked(true); // Indicate that the path check is complete
    }, [pathname]);

    useEffect(() => {
        const handleHover = () => setSideNavWidth(100); // Set desired width on hover
        const handleHoverOut = () => setSideNavWidth(80); // Reset width on hover out
        const sideNavElement = sideNavRef.current;

        if (sideNavElement) {
            sideNavElement.addEventListener('mouseenter', handleHover);
            sideNavElement.addEventListener('mouseleave', handleHoverOut);
        }

        return () => {
            if (sideNavElement) {
                sideNavElement.removeEventListener('mouseenter', handleHover);
                sideNavElement.removeEventListener('mouseleave', handleHoverOut);
            }
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            {isPathChecked && showSideNav && (
                <div ref={sideNavRef} className={styles.sidenav} style={{ width: `${sideNavWidth}px` }}>
                    <SideNav />
                </div>
            )}
            <main
                style={{
                    flexGrow: 1,
                    marginLeft: isPathChecked && showSideNav ? `${sideNavWidth}px` : '0',
                    transition: 'margin-left 0.3s ease', // Smooth transition for margin-left
                }}
            >
                {children}
            </main>
        </div>
    );
}
