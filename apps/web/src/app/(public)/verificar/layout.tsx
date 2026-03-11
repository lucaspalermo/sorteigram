import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar Sorteio - Confirme se o Resultado Foi Justo",
  description:
    "Verifique se um sorteio do SorteiGram foi justo usando hash criptográfico SHA-256. Transparência total: qualquer pessoa pode auditar o resultado.",
  keywords: [
    "verificar sorteio",
    "sorteio justo",
    "sorteio auditável",
    "sorteio transparente",
    "provably fair",
    "hash criptográfico sorteio",
  ],
  alternates: { canonical: "/verificar" },
  openGraph: {
    title: "Verificar Sorteio - SorteiGram",
    description:
      "Confirme que um sorteio foi justo com hash criptográfico SHA-256. Transparência total.",
    url: "/verificar",
  },
};

export default function VerificarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
