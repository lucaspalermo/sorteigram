import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ver Foto de Perfil do Instagram em HD - Download Grátis",
  description:
    "Veja e baixe fotos de perfil do Instagram em alta resolução (HD). Ferramenta grátis, sem cadastro, sem limite de uso. Digite o username e baixe a foto em tamanho original.",
  keywords: [
    "foto perfil instagram HD",
    "ver foto perfil instagram",
    "baixar foto perfil instagram",
    "foto perfil instagram tamanho original",
    "instagram profile picture download",
    "foto perfil instagram grande",
    "ampliar foto perfil instagram",
  ],
  alternates: { canonical: "/ferramentas/foto-perfil" },
  openGraph: {
    title: "Foto de Perfil Instagram HD - Download Grátis",
    description:
      "Veja e baixe fotos de perfil do Instagram em alta resolução. Grátis, sem cadastro.",
    url: "/ferramentas/foto-perfil",
  },
};

export default function FotoPerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
