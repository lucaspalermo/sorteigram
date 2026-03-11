import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorteio Instagram Grátis Online - Sortear Comentários em Segundos",
  description:
    "Faça sorteio no Instagram grátis e online. Cole o link do post, escolha as regras e sorteie comentários em segundos. Resultado auditável com hash criptográfico. Sem cadastro.",
  keywords: [
    "sorteio instagram grátis",
    "sortear comentários instagram",
    "sorteio online grátis",
    "sorteio de comentários",
    "como sortear no instagram",
    "instagram comment picker",
    "sorteio instagram sem cadastro",
  ],
  alternates: { canonical: "/sortear" },
  openGraph: {
    title: "Sorteio Instagram Grátis - Sortear Comentários Online",
    description:
      "Cole o link do post e sorteie em segundos. Grátis, sem cadastro, resultado verificável.",
    url: "/sortear",
  },
};

export default function SortearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
