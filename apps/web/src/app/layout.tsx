import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteigram.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SorteiGram - Sorteio Instagram Grátis e Auditável",
    template: "%s | SorteiGram",
  },
  description:
    "Faça sorteio no Instagram grátis com resultado verificável. Sorteio auditável com hash criptográfico, anti-fraude com IA. Funciona com YouTube, TikTok, Twitter e Facebook.",
  keywords: [
    "sorteio instagram",
    "sorteio instagram grátis",
    "sortear comentários instagram",
    "sorteio de comentários",
    "como sortear no instagram",
    "giveaway instagram",
    "sorteio auditável",
    "instagram comment picker",
    "instagram giveaway picker",
    "sorteio transparente",
    "sorteio provably fair",
    "ferramenta sorteio instagram",
    "sorteio online grátis",
    "sortear no youtube",
    "sorteio tiktok",
  ],
  authors: [{ name: "SorteiGram" }],
  creator: "SorteiGram",
  publisher: "SorteiGram",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    siteName: "SorteiGram",
    title: "SorteiGram - Sorteio Instagram Grátis e Auditável",
    description:
      "Faça sorteio no Instagram grátis com resultado verificável. Hash criptográfico, anti-fraude com IA. Sem cadastro.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SorteiGram - Sorteio Instagram Auditável",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SorteiGram - Sorteio Instagram Grátis e Auditável",
    description:
      "Sorteio no Instagram com resultado verificável por qualquer pessoa. Grátis, sem cadastro.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "pt-BR": baseUrl,
      "en": `${baseUrl}/en`,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
