import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";

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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ligne — Standard téléphonique IA pour restaurants, snacks et pizzerias",
    template: "%s | Ligne",
  },
  description:
    "Ligne décroche les appels de votre restaurant 24h/24, prend les commandes à la voix et les envoie en cuisine avec SMS de confirmation. Plus aucun appel manqué au rush. Installé en 24 h.",
  keywords: [
    "réceptionniste téléphonique IA",
    "réceptionniste téléphonique restaurant",
    "agent vocal restaurant",
    "IA téléphone restaurant",
    "standard téléphonique restaurant",
    "prise de commande téléphone automatisée",
    "appels manqués restaurant",
    "assistant vocal restauration",
    "Ligne",
    "commande téléphonique IA",
    "standard téléphonique IA restaurant",
    "répondeur intelligent restaurant",
    "prise de commande par téléphone snack",
    "logiciel commande téléphone pizzeria",
    "agent vocal IA kebab",
  ],
  authors: [{ name: "Ligne" }],
  creator: "Ligne",
  publisher: "Ligne",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/ligne-icon.png", type: "image/png" }],
    apple: [{ url: "/ligne-apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Ligne",
    title: "Ligne — Le standard téléphonique IA des restaurants",
    description:
      "L’IA qui décroche, prend les commandes et les envoie en cuisine. 24h/24 pour fast-food, snack, pizzeria et restaurants.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ligne — Le standard téléphonique IA des restaurants",
    description:
      "Ne ratez plus aucun appel. Agent vocal IA, écran cuisine et dashboard pour la restauration.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${dmSans.variable} ${syne.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
