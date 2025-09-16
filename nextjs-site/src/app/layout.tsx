import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MainLayout from "@/components/templates/MainLayout";
import SessionProvider from "@/components/providers/SessionProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GAPathTracker from "@/components/GAPathTracker";

const orbitron = Orbitron({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-orbitron'
});

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "FatesBlind Portal",
  description: "A portal to the world of FatesBlind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7291878673566057" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7291878673566057"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <GAPathTracker />
        <SessionProvider>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
