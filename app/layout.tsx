import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Providers from "../components/Providers";
import Modal from "@/components/Modal/Modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.TITLE,
  description: process.env.DESCRIPTION
};

export default function RootLayout({
  children,
  interception
}: Readonly<{
  children: React.ReactNode;
  interception: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <link rel="icon" href="/book.png" type="image/png" sizes="32x32" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Providers>
          <Navbar />
          {children}
          {interception}
          <Modal />
        </Providers>
      </body>
    </html>
  );
}
