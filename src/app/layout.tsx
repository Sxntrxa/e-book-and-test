import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/components/SettingsProvider";
import SettingsMenu from "@/components/SettingsMenu";

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
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col text-[var(--foreground)] overflow-x-hidden relative transition-colors duration-300">
        <SettingsProvider>
          {/* iOS Liquid Background */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--blob-1)] blur-[120px] transition-colors duration-700 transform-gpu"></div>
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[var(--blob-2)] blur-[120px] transition-colors duration-700 transform-gpu"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-[var(--blob-3)] blur-[140px] transition-colors duration-700 transform-gpu"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[25%] h-[25%] rounded-full bg-[var(--blob-4)] blur-[100px] transition-colors duration-700 transform-gpu"></div>
          </div>
          
          <SettingsMenu />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
