import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HandyDandy PWA",
  description:
    "A handy progressive web app with tools, guides, and voice control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          href="/images/tools-and-utensils_128.png"
        />
        <meta name="theme-color" content="#4CAF50" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
