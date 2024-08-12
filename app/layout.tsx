// app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';
import "@uploadthing/react/styles.css";
import ClientWrapper from '@/clientWrapper';
const inter = Inter({ subsets: ["latin"] });



const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata:Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chatter Project",
  description: "This is Content createion platform for developers and readers",
};

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