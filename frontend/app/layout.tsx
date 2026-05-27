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
  title: "FlexDesk — Бронирование рабочих мест",
  description: "Система почасового бронирования столов и переговорных комнат в офисе",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-dark-bg`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-200">
        {children}
      </body>
    </html>
  );
}