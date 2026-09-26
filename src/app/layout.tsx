import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Book & Test",
  description: "E-Book and Test System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white overflow-x-hidden relative">
        {/* iOS Liquid Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/40 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-indigo-900/40 blur-[140px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[25%] h-[25%] rounded-full bg-cyan-900/30 blur-[100px]"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
