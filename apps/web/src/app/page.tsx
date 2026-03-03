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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-instagram-gradient flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">
              Sortei<span className="text-brand-600">Gram</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm text-gray-600 hover:text-gray-900">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm text-gray-600 hover:text-gray-900">
              Preços
            </a>
            <a href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900">
              Como funciona
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Sorteio auditável e verificável
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            O sorteio do Instagram que{" "}
            <span className="bg-instagram-gradient bg-clip-text text-transparent">
              ninguém pode duvidar
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sorteie comentários do Instagram com algoritmo auditável. Qualquer pessoa
            pode verificar que o resultado foi justo. Anti-fraude integrado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-brand-600 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Fazer primeiro sorteio grátis
            </Link>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Como funciona
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Grátis para até 500 comentários. Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que o SorteiGram é diferente?
            </h2>
            <p className="text-gray-600 text-lg">
              Tudo que os concorrentes oferecem, mais o que eles não conseguem fazer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Provably Fair"
              description="Hash criptográfico publicado ANTES do sorteio. Qualquer pessoa pode verificar que não houve manipulação."
              badge="Exclusivo"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Anti-Fraude"
              description="Detecta contas fake, bots e comentários duplicados automaticamente com score de legitimidade."
              badge="IA"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics"
              description="Métricas de engajamento antes/depois do sorteio. Relatório PDF profissional para marcas."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Multi-Post"
              description="Combine comentários de vários posts num único sorteio. Ideal para campanhas grandes."
            />
            <FeatureCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Regras Avançadas"
              description="Marcar amigos, usar hashtag, seguir perfil - configure e filtre automaticamente."
            />
            <FeatureCard
              icon={<Star className="w-6 h-6" />}
              title="Certificado Digital"
              description="Certificado com QR code verificável. Compartilhe nos Stories para mostrar transparência."
            />
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-gray-600 text-lg">
              3 passos simples. Menos de 2 minutos.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Selecione o post"
              description="Conecte sua conta Instagram e escolha o post (ou posts) do sorteio."
            />
            <StepCard
              number="2"
              title="Configure as regras"
              description="Marcar amigos, hashtag, número de ganhadores. O sistema filtra automaticamente."
            />
            <StepCard
              number="3"
              title="Sorteie!"
              description="Clique e pronto. Resultado verificável com hash criptográfico e certificado digital."
            />
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planos simples, sem surpresas
            </h2>
            <p className="text-gray-600 text-lg">
              Comece grátis. Pague quando crescer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PriceCard
              name="Free"
              price="R$ 0"
              period=""
              features={[
                "1 sorteio/mês",
                "Até 500 comentários",
                "Sorteio auditável",
                "1 ganhador por sorteio",
              ]}
            />
            <PriceCard
              name="Creator"
              price="R$ 29"
              period="/mês"
              features={[
                "Sorteios ilimitados",
                "Comentários ilimitados",
                "Anti-fraude básico",
                "Até 5 ganhadores",
                "Live Draw",
              ]}
              highlighted
            />
            <PriceCard
              name="Business"
              price="R$ 79"
              period="/mês"
              features={[
                "Tudo do Creator",
                "Analytics completo",
                "Multi-post",
                "Relatório PDF",
                "Até 50 ganhadores",
                "Suporte prioritário",
              ]}
            />
            <PriceCard
              name="Agency"
              price="R$ 199"
              period="/mês"
              features={[
                "Tudo do Business",
                "White-label",
                "Múltiplas contas",
                "API de integração",
                "Suporte VIP",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para fazer seu primeiro sorteio?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Junte-se a milhares de influenciadores e marcas que confiam no SorteiGram.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Começar grátis agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-instagram-gradient flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">SorteiGram</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SorteiGram. Todos os direitos reservados.
          </p>
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
    <div className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow relative">
      {badge && (
        <span className="absolute top-4 right-4 bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-brand-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  period,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border-2 ${
        highlighted
          ? "border-brand-600 bg-brand-50 shadow-lg relative"
          : "border-gray-200 bg-white"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Mais popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500 text-sm">{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          highlighted
            ? "bg-brand-600 text-white hover:bg-brand-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {price === "R$ 0" ? "Começar grátis" : "Assinar agora"}
      </Link>
    </div>
  );
}
