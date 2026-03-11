import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Dicas e Guias sobre Sorteios no Instagram",
  description:
    "Aprenda tudo sobre sorteios no Instagram: como fazer, melhores ferramentas grátis, dicas para engajamento, legislação e tecnologia por trás de sorteios auditáveis.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog SorteiGram - Guias sobre Sorteios no Instagram",
    description:
      "Guias completos sobre como fazer sorteios no Instagram, YouTube, TikTok e mais.",
    url: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
