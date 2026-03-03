import { BarChart3, Lock } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
      <p className="text-gray-600 mb-8">
        Acompanhe o desempenho dos seus sorteios
      </p>

      <div className="bg-white rounded-2xl border p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Analytics Premium
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Desbloqueie métricas avançadas como engajamento antes/depois do
          sorteio, crescimento de seguidores e relatórios PDF profissionais.
        </p>
        <Link
          href="/configuracoes"
          className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors"
        >
          Fazer upgrade para Business
        </Link>
      </div>
    </div>
  );
}
