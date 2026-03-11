import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferramentas Grátis para Instagram - Sorteio, Foto HD, Story Viewer",
  description:
    "Ferramentas 100% grátis para Instagram: sorteio de comentários, foto de perfil em HD, story viewer anônimo e verificador de sorteio. Sem cadastro, sem limites.",
  keywords: [
    "ferramentas instagram grátis",
    "foto perfil instagram HD",
    "story viewer instagram",
    "sorteio instagram",
    "ferramentas grátis redes sociais",
  ],
  alternates: { canonical: "/ferramentas" },
  openGraph: {
    title: "Ferramentas Grátis para Instagram - SorteiGram",
    description:
      "Sorteio, foto de perfil HD, story viewer anônimo. 100% grátis, sem cadastro.",
    url: "/ferramentas",
  },
};

export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
