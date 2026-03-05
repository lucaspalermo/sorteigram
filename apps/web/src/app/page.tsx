import Link from "next/link";
import {
  Shield,
  Zap,
  BarChart3,
  Users,
  CheckCircle,
  Instagram,
  ArrowRight,
  Star,
  Play,
  Globe,
  Lock,
  FileText,
  Video,
  Search,
  Filter,
  Download,
  Trophy,
  Sparkles,
  Youtube,
  Twitter,
  Facebook,
  Clock,
  Eye,
  QrCode,
  ChevronRight,
} from "lucide-react";

const STATS = [
  { value: "50.000+", label: "Sorteios realizados" },
  { value: "12M+", label: "Comentários processados" },
  { value: "99.9%", label: "Uptime garantido" },
  { value: "4.9/5", label: "Avaliação dos usuários" },
];

const PLATFORMS = [
  { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { name: "YouTube", icon: Youtube, color: "from-red-500 to-red-700" },
  { name: "TikTok", icon: Play, color: "from-gray-900 to-gray-700" },
  { name: "Twitter/X", icon: Twitter, color: "from-blue-400 to-blue-600" },
  { name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-800" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Sortei<span className="text-purple-600">Gram</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "#funcionalidades", label: "Funcionalidades" },
              { href: "#plataformas", label: "Plataformas" },
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#precos", label: "Precos" },
              { href: "/ferramentas", label: "Ferramentas" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/sortear"
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-200"
            >
              Sortear gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-100/60 via-pink-50/40 to-transparent rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-purple-100">
            <Shield className="w-4 h-4" />
            O unico sorteio Provably Fair do Brasil
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Sorteie com{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent text-gradient-animated">
              transparencia total
            </span>
            <br />
            <span className="text-gray-400 text-4xl sm:text-5xl lg:text-6xl font-bold">
              em qualquer rede social
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Cole o link do post, configure as regras e sorteie. Resultado{" "}
            <strong className="text-gray-700">verificavel por qualquer pessoa</strong>{" "}
            com hash criptografico. Anti-fraude com IA integrado.
          </p>

          {/* CTA Area - Quick giveaway input */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="flex gap-2 p-2 bg-white rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100 hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-2 pl-3 text-gray-400">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Cole o link do post do Instagram, YouTube, TikTok..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 py-2"
                readOnly
              />
              <Link
                href="/sortear"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Sortear
              </Link>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-12">
            Gratis ate 500 comentarios. Sem cadastro. Sem cartao de credito.
          </p>

          {/* Platform icons */}
          <div className="flex items-center justify-center gap-3 mb-16">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-default`}
                title={p.name}
              >
                <p.icon className="w-5 h-5 text-white" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 border-y bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-gray-400 text-sm">
          <span>Usado por criadores de conteudo e marcas como:</span>
          {["@influencer1", "@marca_br", "@loja_oficial", "@digital_mkt", "@creator.pro"].map((name) => (
            <span key={name} className="font-semibold text-gray-500">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Tudo que voce precisa para sortear
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Features de nivel profissional que nenhum concorrente oferece junto.
            </p>
          </div>

          {/* Main feature - Provably Fair */}
          <div className="mb-8 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Lock className="w-3.5 h-3.5" />
                  Exclusivo SorteiGram
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Sorteio Provably Fair
                </h3>
                <p className="text-purple-100 leading-relaxed mb-6">
                  Hash SHA-256 publicado <strong className="text-white">ANTES</strong> do
                  sorteio. Apos o resultado, revelamos o seed. Qualquer pessoa pode rodar o
                  mesmo algoritmo e confirmar que nao houve manipulacao. Tecnologia usada em
                  cassinos online de alto nivel.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/15 px-3 py-1 rounded-lg text-sm">
                    SHA-256
                  </span>
                  <span className="bg-white/15 px-3 py-1 rounded-lg text-sm">
                    Fisher-Yates
                  </span>
                  <span className="bg-white/15 px-3 py-1 rounded-lg text-sm">
                    Seed deterministico
                  </span>
                  <span className="bg-white/15 px-3 py-1 rounded-lg text-sm">
                    Verificacao publica
                  </span>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 font-mono text-sm space-y-3 backdrop-blur-sm">
                <div className="text-purple-200">// Antes do sorteio</div>
                <div>
                  <span className="text-purple-300">hash_publicado</span> ={" "}
                  <span className="text-green-300">&quot;a3f8c2...&quot;</span>
                </div>
                <div className="text-purple-200 mt-4">// Apos o sorteio</div>
                <div>
                  <span className="text-purple-300">seed_revelado</span> ={" "}
                  <span className="text-green-300">&quot;7b2d4e...&quot;</span>
                </div>
                <div>
                  <span className="text-yellow-300">SHA256</span>(seed) =={" "}
                  hash_publicado <span className="text-green-400">✓</span>
                </div>
                <div className="text-purple-200 mt-4">// Qualquer pessoa pode verificar</div>
                <div>
                  <span className="text-yellow-300">sortear</span>(participantes,
                  seed) → <span className="text-green-400">@vencedor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Anti-Fraude com IA"
              description="Detecta bots, contas fake e comentarios negativos automaticamente. Score de legitimidade para cada participante."
              badge="IA"
            />
            <FeatureCard
              icon={<Video className="w-5 h-5" />}
              title="Animacao + Gravacao"
              description="Sorteio animado com countdown e roleta visual. Grava automaticamente em video para compartilhar nos Stories."
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Certificado Digital"
              description="Certificado com QR code verificavel, otimizado para Instagram Stories. Prova publica de transparencia."
            />
            <FeatureCard
              icon={<Filter className="w-5 h-5" />}
              title="Filtros Avancados"
              description="Tags minimas, frases obrigatorias, hashtags, bloqueio de usuarios, remocao de duplicatas."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Multi-Post"
              description="Combine comentarios de varios posts em um unico sorteio. Ideal para campanhas grandes."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Analytics Premium"
              description="Engajamento antes/depois, crescimento de seguidores, relatorio PDF profissional para marcas."
            />
            <FeatureCard
              icon={<Search className="w-5 h-5" />}
              title="Resultados Publicos"
              description="Pagina publica com todos os participantes. Qualquer pessoa busca por codigo e verifica o resultado."
            />
            <FeatureCard
              icon={<Download className="w-5 h-5" />}
              title="Export XLS/CSV"
              description="Baixe a lista completa de participantes, comentarios e resultados em planilha."
            />
            <FeatureCard
              icon={<Eye className="w-5 h-5" />}
              title="Sem Conta Necessaria"
              description="Sorteios basicos sem login. Cole o link e sorteie na hora. Conta necessaria so para features premium."
            />
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="plataformas" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Multi-plataforma
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Sorteie em qualquer rede social
            </h2>
            <p className="text-gray-500 text-lg">
              Combine participantes de plataformas diferentes em um unico sorteio.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl border p-6 text-center hover:shadow-lg hover:border-purple-200 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Comentarios + Likes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Simples e rapido
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              3 passos. Menos de 1 minuto.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "1",
                icon: <Globe className="w-6 h-6" />,
                title: "Cole o link",
                desc: "Cole a URL do post do Instagram, YouTube, TikTok, Twitter ou Facebook. Buscamos todos os comentarios automaticamente.",
              },
              {
                n: "2",
                icon: <Filter className="w-6 h-6" />,
                title: "Configure regras",
                desc: "Marcar amigos, hashtag obrigatoria, filtrar bots. Ou simplesmente sorteie sem nenhum filtro.",
              },
              {
                n: "3",
                icon: <Trophy className="w-6 h-6" />,
                title: "Sorteie!",
                desc: "Animacao com countdown, resultado verificavel com hash, certificado pronto para Stories e video gravado.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="relative bg-white rounded-2xl border p-8 hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-purple-600 text-white text-lg font-bold flex items-center justify-center shadow-lg shadow-purple-200">
                  {step.n}
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 mt-2">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Precos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Comece gratis. Escale quando crescer.
            </h2>
            <p className="text-gray-500 text-lg">
              Pague com PIX, Boleto ou Cartao. Cancele quando quiser.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <PriceCard
              name="Free"
              price="R$ 0"
              period=""
              description="Para experimentar"
              features={[
                "3 sorteios/mes",
                "Ate 500 comentarios",
                "Sorteio auditavel (Provably Fair)",
                "1 ganhador por sorteio",
                "Sem cadastro necessario",
              ]}
            />
            <PriceCard
              name="Creator"
              price="R$ 29"
              period="/mes"
              description="Para influenciadores"
              features={[
                "Sorteios ilimitados",
                "Ate 40.000 comentarios",
                "Anti-fraude basico",
                "Ate 10 ganhadores + suplentes",
                "Certificado para Stories",
                "Video do sorteio",
                "Live Draw animado",
              ]}
              highlighted
            />
            <PriceCard
              name="Business"
              price="R$ 79"
              period="/mes"
              description="Para marcas e lojas"
              features={[
                "Tudo do Creator",
                "Comentarios ilimitados",
                "Anti-fraude avancado (IA)",
                "Multi-post",
                "Analytics completo",
                "Relatorio PDF",
                "Ate 50 ganhadores",
                "Export XLS/CSV",
                "Suporte prioritario",
              ]}
            />
            <PriceCard
              name="Agency"
              price="R$ 199"
              period="/mes"
              description="Para agencias"
              features={[
                "Tudo do Business",
                "White-label (sua marca)",
                "Multiplas contas",
                "API de integracao",
                "Regulamento automatico (LGPD)",
                "Suporte VIP",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Free Tools section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
              Ferramentas gratis
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Ferramentas gratis para todo mundo
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Instagram className="w-5 h-5" />, title: "Foto de Perfil HD", desc: "Baixe fotos de perfil do Instagram em alta resolucao", href: "/ferramentas/foto-perfil" },
              { icon: <Eye className="w-5 h-5" />, title: "Story Anonimo", desc: "Veja stories do Instagram sem que a pessoa saiba", href: "/ferramentas/story-viewer" },
              { icon: <QrCode className="w-5 h-5" />, title: "Verificar Sorteio", desc: "Confira se um resultado de sorteio foi justo", href: "/verificar" },
              { icon: <Clock className="w-5 h-5" />, title: "Sorteio Rapido", desc: "Cole o link e sorteie agora, sem criar conta", href: "/sortear" },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-purple-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{tool.title}</h3>
                <p className="text-gray-500 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para o sorteio mais transparente que existe?
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Junte-se a milhares de criadores e marcas. Primeiro sorteio gratis, sem cadastro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sortear"
              className="w-full sm:w-auto bg-white text-purple-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Sortear agora gratis
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Criar conta
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">SorteiGram</span>
              </div>
              <p className="text-sm text-gray-500">
                A plataforma de sorteio mais transparente do Brasil.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Produto</h4>
              <div className="space-y-2">
                {["Funcionalidades", "Precos", "Plataformas", "API"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-gray-500 hover:text-gray-700">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Ferramentas</h4>
              <div className="space-y-2">
                {["Sortear Gratis", "Foto Perfil HD", "Story Anonimo", "Verificar Sorteio"].map(
                  (item) => (
                    <a key={item} href="#" className="block text-sm text-gray-500 hover:text-gray-700">
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
              <div className="space-y-2">
                {["Termos de Uso", "Privacidade", "LGPD", "Contato"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-gray-500 hover:text-gray-700">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SorteiGram. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {PLATFORMS.slice(0, 4).map((p) => (
                <p.icon key={p.name} className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border hover:shadow-lg hover:border-purple-100 transition-all relative group">
      {badge && (
        <span className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-shadow ${
        highlighted
          ? "border-purple-600 bg-purple-50/50 shadow-xl shadow-purple-100 relative"
          : "border-gray-200 bg-white hover:shadow-lg"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
          Mais popular
        </span>
      )}
      <h3 className="font-bold text-gray-900">{name}</h3>
      <p className="text-xs text-gray-500 mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-3xl font-extrabold text-gray-900">{price}</span>
        <span className="text-gray-400 text-sm">{period}</span>
      </div>
      <ul className="space-y-2.5 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={price === "R$ 0" ? "/sortear" : "/login"}
        className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${
          highlighted
            ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {price === "R$ 0" ? "Comecar gratis" : "Assinar agora"}
      </Link>
    </div>
  );
}
