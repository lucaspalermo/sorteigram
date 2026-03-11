import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do SorteiGram. Condições para utilização da plataforma de sorteios.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermosDeUsoPage() {
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

      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-gray">
        <h1>Termos de Uso</h1>
        <p><strong>Última atualização:</strong> 11 de março de 2026</p>

        <h2>1. Aceitação dos Termos</h2>
        <p>Ao acessar ou utilizar o SorteiGram (&quot;Plataforma&quot;), você concorda com estes Termos de Uso. Se não concordar, não utilize a Plataforma.</p>

        <h2>2. Descrição do Serviço</h2>
        <p>O SorteiGram é uma plataforma de tecnologia que oferece ferramentas para realizar sorteios em redes sociais de forma transparente e auditável, utilizando algoritmos criptográficos (Provably Fair).</p>

        <h2>3. Cadastro e Conta</h2>
        <ul>
          <li>O cadastro é feito via Facebook Login.</li>
          <li>Você é responsável por manter a segurança da sua conta.</li>
          <li>Informações fornecidas devem ser verdadeiras e atualizadas.</li>
        </ul>

        <h2>4. Uso Permitido</h2>
        <p>Você pode utilizar a Plataforma para:</p>
        <ul>
          <li>Realizar sorteios de comentários em redes sociais.</li>
          <li>Verificar a integridade de sorteios realizados.</li>
          <li>Utilizar as ferramentas gratuitas disponibilizadas.</li>
        </ul>

        <h2>5. Uso Proibido</h2>
        <p>É proibido:</p>
        <ul>
          <li>Utilizar a Plataforma para atividades ilegais.</li>
          <li>Manipular ou tentar manipular resultados de sorteios.</li>
          <li>Realizar scraping, automação não autorizada ou ataques à Plataforma.</li>
          <li>Violar os Termos de Serviço do Instagram, Facebook ou outras redes sociais.</li>
          <li>Criar sorteios que violem a legislação brasileira.</li>
        </ul>

        <h2>6. Planos e Pagamentos</h2>
        <ul>
          <li>O plano Free é gratuito com limitações.</li>
          <li>Planos pagos são cobrados mensalmente via Asaas (PIX, Boleto ou Cartão).</li>
          <li>O cancelamento pode ser feito a qualquer momento pelo painel.</li>
          <li>Não há reembolso proporcional após o cancelamento.</li>
        </ul>

        <h2>7. Propriedade Intelectual</h2>
        <p>Todo o conteúdo, design, código e algoritmos da Plataforma são propriedade do SorteiGram. É proibida a reprodução sem autorização.</p>

        <h2>8. Limitação de Responsabilidade</h2>
        <ul>
          <li>O SorteiGram é uma plataforma de tecnologia e não se responsabiliza pelo cumprimento de regras de sorteios por parte dos organizadores.</li>
          <li>Não garantimos disponibilidade ininterrupta do serviço.</li>
          <li>O organizador do sorteio é o único responsável pelo cumprimento da legislação aplicável.</li>
        </ul>

        <h2>9. Legislação sobre Sorteios</h2>
        <p>Sorteios no Brasil são regulados pela Lei nº 5.768/71. Sorteios promocionais com prêmios acima de determinados valores podem necessitar de autorização da SECAP/ME. O SorteiGram não fornece consultoria jurídica — recomendamos que organizadores consultem um advogado.</p>

        <h2>10. Alterações</h2>
        <p>Podemos alterar estes Termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou aviso na Plataforma.</p>

        <h2>11. Foro</h2>
        <p>Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro da comarca do domicílio do usuário para dirimir quaisquer controvérsias.</p>

        <h2>12. Contato</h2>
        <p>Para dúvidas sobre estes Termos, entre em contato:</p>
        <ul>
          <li><strong>E-mail:</strong> l.simports@hotmail.com</li>
        </ul>
      </div>
    </div>
  );
}
