import Link from "next/link";
import {
  Trophy,
  Instagram,
  Eye,
  Search,
  Clock,
  Dice1,
  QrCode,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Sorteio Rapido",
    desc: "Cole o link do post e sorteie instantaneamente. Sem login necessario.",
    href: "/sortear",
    gradient: "from-purple-600 to-indigo-600",
    featured: true,
  },
  {
    icon: <Instagram className="w-6 h-6" />,
    title: "Foto de Perfil HD",
    desc: "Visualize e baixe fotos de perfil do Instagram em alta resolucao.",
    href: "/ferramentas/foto-perfil",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Story Viewer Anonimo",
    desc: "Veja stories do Instagram sem que a pessoa saiba. Totalmente anonimo.",
    href: "/ferramentas/story-viewer",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    icon: <QrCode className="w-6 h-6" />,
    title: "Verificar Sorteio",
    desc: "Confirme que um resultado de sorteio foi justo com hash criptografico.",
    href: "/verificar",
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function FerramentasPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">
              Sortei<span className="text-purple-600">Gram</span>
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Ferramentas Gratis
          </h1>
          <p className="text-gray-500 text-lg">
            Todas as ferramentas sao 100% gratis, sem cadastro e sem limites.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className={`rounded-2xl border p-6 hover:shadow-xl transition-all group ${
                tool.featured
                  ? "sm:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                  : "bg-white hover:border-purple-200"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {tool.icon}
              </div>
              <h2 className="font-bold text-gray-900 text-lg mb-1">{tool.title}</h2>
              <p className="text-gray-500 text-sm">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
