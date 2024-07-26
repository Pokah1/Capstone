// app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from '@/metadata';
// import "@uploadthing/react/styles.css";
import ClientWrapper from '@/clientWrapper';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground bg-slate-900"  >
       
          <ClientWrapper>
            <main className="min-h-screen flex flex-col items-center">
            {children}
            </main>
          </ClientWrapper>
      </body>
    </html>
  );
}