import "./globals.css";
import "./styles/vars.css";
import "./styles/style.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import NextAbstractWalletProvider from "@/components/NextAbstractWalletProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const avenueMono = localFont({
  src: "../fonts/Avenue Mono.ttf",
  variable: "--font-avenue-mono",
});
const roobert = localFont({
  src: [
    { path: "../fonts/Roobert-Light.ttf", weight: "300" },
    { path: "../fonts/Roobert-Regular.ttf", weight: "400" },
  ],
  variable: "--font-roobert",
});

export const metadata: Metadata = {
  title: "Feelings - A story of resilience",
  description: "Feelings – Generative art",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          ${avenueMono.variable} ${roobert.variable}
          antialiased flex flex-col min-h-screen
        `}
      >
        <NextAbstractWalletProvider>
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextAbstractWalletProvider>
      </body>
    </html>
  );
}
