import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/templates/MainLayout";
import Provider from "@/components/providers/SessionProvider";
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7291878673566057"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <GAPathTracker />
        <Provider>
          <MainLayout>{children}</MainLayout>
        </Provider>
      </body>
    </html>
  );
}
