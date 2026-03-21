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
  title: {
    default: "Verqify — Verified by work, not words.",
    template: "%s | Verqify",
  },
  description:
    "India's first verified builder platform. Build real projects, get verified by AI, get discovered by companies.",
  keywords: [
    "developer platform",
    "github score",
    "verified builders",
    "student developers",
    "tech hiring",
    "India",
  ],
  openGraph: {
    title: "Verqify — Verified by work, not words.",
    description:
      "Build real projects. Get verified by AI. Let companies discover you.",
    type: "website",
    url: "https://verqify.vercel.app",
    siteName: "Verqify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verqify — Verified by work, not words.",
    description:
      "India's first verified builder platform for student developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
