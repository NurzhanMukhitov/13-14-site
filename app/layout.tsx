import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Inter: дисплей (Bold/Black) и основной текст. Один вариативный файл 100–900.
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

// IBM Plex Mono: техническая метаинформация, теги, числа.
const plexMono = localFont({
  src: [
    {
      path: "./fonts/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/IBMPlexMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
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
        className={`${inter.variable} ${plexMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
