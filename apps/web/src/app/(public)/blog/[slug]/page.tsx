import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { articles, articleList } from "../articles";

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    author: { "@type": "Organization", name: "SorteiGram" },
    publisher: {
      "@type": "Organization",
      name: "SorteiGram",
      logo: { "@type": "ImageObject", url: "https://sorteigram.app/icon-512.png" },
    },
  };

  const related = articleList.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      <article className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Blog
        </Link>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="font-medium bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(article.date).toLocaleDateString("pt-BR")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime} de leitura
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
          {article.title}
        </h1>

        <div
          className="prose prose-gray prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-purple-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-li:text-gray-600
            prose-ul:my-4 prose-ol:my-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Pronto para fazer seu sorteio?
          </h3>
          <p className="text-purple-100 mb-6">
            Grátis, sem cadastro, resultado verificável por qualquer pessoa.
          </p>
          <Link
            href="/sortear"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors"
          >
            Sortear agora grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Artigos relacionados
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block bg-white rounded-xl border p-4 hover:shadow-lg hover:border-purple-200 transition-all"
                >
                  <span className="text-xs font-medium text-purple-600">
                    {r.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
