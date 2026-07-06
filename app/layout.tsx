import React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css"; // assuming standard Next.js global css path or index.css

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEN Hair & Skin Secret | Premium Organic Apothecary",
  description: "Formulators of high-performance luxury hair and skin elixirs. Rebalancing pH 5.5 formulations tailored for the hard water systems of Pakistan.",
  metadataBase: new URL("https://wen.com.pk"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#1C1917] bg-[#FFFFFF] min-h-screen selection:bg-[#1F4D3A] selection:text-white">
        <div id="app-root-layout" className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
