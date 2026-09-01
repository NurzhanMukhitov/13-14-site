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
  title: "Nurzhan Mukhitov — Technical Director & Producer",
  description:
    "Technical Director & Producer of live brand events. Lamborghini, Aston Martin, Mercedes-EQ, Samsung, T-Bank.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nurzhan Mukhitov — Technical Director & Producer",
    description:
      "Technical Director & Producer of live brand events. Lamborghini, Aston Martin, Mercedes-EQ, Samsung, T-Bank.",
    url: "https://studio-1314.online",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
