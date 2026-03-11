import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade do SorteiGram. Saiba como coletamos, usamos e protegemos seus dados.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PoliticaPrivacidadePage() {
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
        <h1>Política de Privacidade</h1>
        <p><strong>Última atualização:</strong> 11 de março de 2026</p>

        <h2>1. Informações que Coletamos</h2>
        <p>Ao utilizar o SorteiGram, podemos coletar as seguintes informações:</p>
        <ul>
          <li><strong>Dados de conta:</strong> Nome, e-mail e foto de perfil fornecidos pelo Facebook/Instagram Login.</li>
          <li><strong>Dados do Instagram:</strong> Username, ID do usuário, posts públicos e comentários relacionados a sorteios.</li>
          <li><strong>Dados de uso:</strong> Páginas visitadas, funcionalidades utilizadas e dados de navegação.</li>
          <li><strong>Dados de pagamento:</strong> Processados pelo Asaas. Não armazenamos dados de cartão de crédito.</li>
        </ul>

        <h2>2. Como Usamos seus Dados</h2>
        <ul>
          <li>Autenticar sua conta e fornecer acesso à plataforma.</li>
          <li>Buscar comentários de posts do Instagram para realizar sorteios.</li>
          <li>Processar pagamentos de planos.</li>
          <li>Melhorar a experiência do usuário e a plataforma.</li>
          <li>Enviar comunicações relevantes sobre o serviço.</li>
        </ul>

        <h2>3. Compartilhamento de Dados</h2>
        <p>Não vendemos seus dados pessoais. Compartilhamos dados apenas com:</p>
        <ul>
          <li><strong>Meta/Facebook:</strong> Para autenticação via Facebook Login.</li>
          <li><strong>Asaas:</strong> Para processamento de pagamentos.</li>
          <li><strong>Autoridades legais:</strong> Quando exigido por lei.</li>
        </ul>

        <h2>4. Armazenamento e Segurança</h2>
        <p>Seus dados são armazenados em servidores seguros com criptografia. Utilizamos HTTPS em toda a plataforma e seguimos as melhores práticas de segurança da informação.</p>

        <h2>5. Seus Direitos (LGPD)</h2>
        <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
        <ul>
          <li>Acessar seus dados pessoais.</li>
          <li>Corrigir dados incompletos ou desatualizados.</li>
          <li>Solicitar a exclusão dos seus dados.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
          <li>Solicitar a portabilidade dos dados.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>Utilizamos cookies essenciais para funcionamento da autenticação e da sessão do usuário. Não utilizamos cookies de rastreamento de terceiros.</p>

        <h2>7. Exclusão de Dados</h2>
        <p>Para solicitar a exclusão dos seus dados, envie um e-mail para <strong>l.simports@hotmail.com</strong> com o assunto &quot;Exclusão de Dados&quot;. Processaremos sua solicitação em até 15 dias úteis.</p>

        <h2>8. Contato</h2>
        <p>Para dúvidas sobre esta política, entre em contato:</p>
        <ul>
          <li><strong>E-mail:</strong> l.simports@hotmail.com</li>
        </ul>

        <h2>9. Alterações</h2>
        <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas por e-mail ou aviso na plataforma.</p>
      </div>
    </div>
  );
}
