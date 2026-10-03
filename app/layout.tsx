import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Analytics } from '@vercel/analytics/next';
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
    "Authentic field narratives, fly patterns, species guides, coastal explorations, and AI vector search benchmark lab.",
  icons: {
    icon: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/og-image.jpg",
    apple: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/og-image.jpg",
  },
  openGraph: {
    title: "Cast & Catch Stories | The Angler's Field Journal",
    description:
      "Authentic field narratives, species guides, coastal explorations, and AI vector search benchmark lab.",
    siteName: "Cast & Catch Stories",
    images: [
      {
        url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/Jamesfish.jpg",
        alt: "Adventures of James Ticatic Fishing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cast & Catch Stories | The Angler's Field Journal",
    description: "Authentic angling logs & AI vector search lab.",
    images: ["https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/Jamesfish.jpg"],
  },
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
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-200">Cast &amp; Catch Stories | Vector Search Lab</p>
              <p className="text-slate-500 mt-0.5">Built with Next.js App Router, Gemini Embeddings, and pgvector.</p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/JamesTicatic/FishingProject#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 font-medium transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Developer README
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
