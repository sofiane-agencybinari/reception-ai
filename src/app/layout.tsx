import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
      className={`${dmSans.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
