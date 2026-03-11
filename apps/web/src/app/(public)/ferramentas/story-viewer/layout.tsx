import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story Viewer Anônimo Instagram - Ver Stories Sem Ser Visto",
  description:
    "Veja stories do Instagram de forma anônima, sem que a pessoa saiba. Story viewer grátis, sem cadastro, funciona com contas públicas. 100% anônimo e seguro.",
  keywords: [
    "story viewer instagram",
    "ver story instagram anônimo",
    "story viewer anônimo",
    "ver stories sem ser visto",
    "instagram story viewer",
    "ver story sem conta",
    "story instagram anônimo grátis",
  ],
  alternates: { canonical: "/ferramentas/story-viewer" },
  openGraph: {
    title: "Story Viewer Anônimo Instagram - Grátis",
    description:
      "Veja stories do Instagram sem que a pessoa saiba. 100% anônimo e grátis.",
    url: "/ferramentas/story-viewer",
  },
};

export default function StoryViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
