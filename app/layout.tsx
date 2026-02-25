import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Oshani Jayawardane",
  description: "Engineer, researcher, builder. Projects and thoughts by Oshi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900`}
      >
        <nav className="flex justify-between items-center px-6 sm:px-8 lg:px-12 py-5 lg:py-6 border-b bg-white text-zinc-900">
          {/* Logo */}
          <div className="font-semibold text-lg sm:text-xl lg:text-3xl tracking-tight">
            <Link href="/">Oshani</Link>
          </div>

          {/* Links */}
          <div className="flex gap-6 sm:gap-8 text-sm sm:text-base lg:text-xl">
            <Link href="/projects" className="hover:underline">
              Projects
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12">{children}</main>
      </body>
    </html>
  );
}
