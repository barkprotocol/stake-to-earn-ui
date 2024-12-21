import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import "./styles/globals.css";
import Providers from "@/components/providers";
import ToastProvider from "@/components/providers/toast-provider";
import { Navbar } from '@/components/ui/layout/navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BARK Token Airdrop Eligibility",
  description: "Check your eligibility for the exclusive $BARK token airdrop on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-black text-white flex flex-col min-h-screen">
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow p-4">
              {children}
            </main>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
