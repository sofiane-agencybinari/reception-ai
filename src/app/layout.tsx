import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "ASTOR — L'IA qui prend vos commandes par telephone",
  description:
    "ASTOR decroche, prend les commandes, les envoie en cuisine et trace vos ventes. IA vocale 24h/24 pour fast-food, snack et pizzeria.",
  openGraph: {
    title: "ASTOR — Commandes telephoniques automatisees",
    description: "Ne ratez plus aucune commande. Agent vocal, ecran cuisine et dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
