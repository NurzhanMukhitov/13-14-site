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
  title: "13 | 14 — Digital visual artist",
  description:
    "Digital visual artist. From generative systems to interactive environments. Code, motion, structure.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "13 | 14 — Digital visual artist",
    description:
      "From generative systems to interactive environments. Code, motion, structure.",
    url: "https://nurzhanmukhitov.github.io/13.14",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
