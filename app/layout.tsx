import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "Cast & Catch Stories | The Angler's Field Journal",
  description:
    "Foundational fishing stories blog featuring authentic field narratives, fly patterns, species guides, and coastal explorations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Cast &amp; Catch Stories</span>
              <span className="text-slate-400">|</span>
              <span className="text-xs text-slate-500">
                Foundational Corpus for OpenSearch
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <a
                href="/api/stories"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-4"
              >
                Stories JSON API Endpoint
              </a>
              <span className="text-slate-400">© 2026 Field Journal Logs</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
