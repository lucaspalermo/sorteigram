import Link from "next/link";
import { Trophy, ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { articleList } from "./articles";

const categoryColors: Record<string, string> = {
  Guia: "bg-purple-50 text-purple-700",
  Comparativo: "bg-blue-50 text-blue-700",
  Tutorial: "bg-green-50 text-green-700",
  Tecnologia: "bg-orange-50 text-orange-700",
  Guide: "bg-indigo-50 text-indigo-700",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">
              Sortei<span className="text-purple-600">Gram</span>
            </span>
          </Link>
          <Link
            href="/sortear"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Sortear grátis
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Conteúdo
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Blog sobre Sorteios Online
          </h1>
          <p className="text-gray-500 text-lg">
            Guias, tutoriais e dicas para fazer sorteios de sucesso no Instagram
            e outras redes sociais.
          </p>
        </div>

        <div className="space-y-4">
          {articleList.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-purple-200 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span
                  className={`font-medium px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-50 text-gray-600"}`}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.date).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} de leitura
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {article.title}
              </h2>

              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {article.excerpt}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">
                Ler artigo completo <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
