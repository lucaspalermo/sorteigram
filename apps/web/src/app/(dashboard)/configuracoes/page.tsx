"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  User,
  CreditCard,
  Instagram,
  Crown,
  CheckCircle,
  Loader2,
} from "lucide-react";

const planosInfo = {
  FREE: { label: "Free", cor: "text-gray-600 bg-gray-100" },
  CREATOR: { label: "Creator", cor: "text-brand-600 bg-brand-100" },
  BUSINESS: { label: "Business", cor: "text-blue-600 bg-blue-100" },
  AGENCY: { label: "Agency", cor: "text-purple-600 bg-purple-100" },
};

export default function ConfiguracoesPage() {
  const { data: session } = useSession();
  const trpc = useTRPC();
  const { data: plano, isLoading } = useQuery(
    trpc.pagamento.meuPlano.queryOptions()
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h1>
      <p className="text-gray-600 mb-8">Gerencie sua conta e assinatura</p>

      {/* Perfil */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <User className="w-5 h-5" />
          Perfil
        </h2>
        <div className="flex items-center gap-4">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt=""
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Instagram className="w-5 h-5" />
          Instagram
        </h2>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-700">
            Conta conectada via Facebook
          </span>
        </div>
      </section>

      {/* Plano */}
      <section className="bg-white rounded-2xl border p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Crown className="w-5 h-5" />
          Plano atual
        </h2>

        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
        ) : plano ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  planosInfo[plano.plano]?.cor || "text-gray-600 bg-gray-100"
                }`}
              >
                {planosInfo[plano.plano]?.label || plano.plano}
              </span>
            </div>

            {plano.plano === "FREE" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Faça upgrade para desbloquear sorteios ilimitados, anti-fraude e mais.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(["CREATOR", "BUSINESS", "AGENCY"] as const).map((p) => (
                    <button
                      key={p}
                      className="border rounded-xl p-3 text-center hover:border-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <p className="font-semibold text-sm">{planosInfo[p].label}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {p === "CREATOR"
                          ? "R$29/mês"
                          : p === "BUSINESS"
                            ? "R$79/mês"
                            : "R$199/mês"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plano.plano !== "FREE" && (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Assinatura ativa
                </span>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
