import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SorteiGram - Sorteio Instagram Auditável",
  description:
    "A plataforma mais confiável para sorteios no Instagram. Sorteio auditável, anti-fraude e verificável por qualquer pessoa.",
  keywords: [
    "sorteio instagram",
    "sortear instagram",
    "sorteio comentários",
    "giveaway instagram",
    "sorteio auditável",
  ],
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
