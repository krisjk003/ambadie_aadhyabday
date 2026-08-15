import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";
import { GlobalParticleSystem } from "@/components/GlobalParticleSystem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TWO - Cinematic Birthday Experience",
  description: "same birthday. completely different levels of chaos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark hide-scrollbar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-white relative transition-colors duration-1000`}
      >
        <div className="noise-bg"></div>
        <GlobalParticleSystem />
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
