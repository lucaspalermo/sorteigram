"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Gift, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const statusConfig = {
  RASCUNHO: { label: "Rascunho", color: "text-gray-500 bg-gray-100", icon: Clock },
  COLETANDO: { label: "Coletando", color: "text-blue-600 bg-blue-100", icon: Loader2 },
  PRONTO: { label: "Pronto", color: "text-yellow-600 bg-yellow-100", icon: AlertCircle },
  REALIZADO: { label: "Realizado", color: "text-green-600 bg-green-100", icon: CheckCircle },
  CANCELADO: { label: "Cancelado", color: "text-red-600 bg-red-100", icon: AlertCircle },
};

export default function SorteiosPage() {
  const trpc = useTRPC();
  const { data: sorteios, isLoading } = useQuery(trpc.sorteio.listar.queryOptions());

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Sorteios</h1>
          <p className="text-gray-600 mt-1">Gerencie seus sorteios do Instagram</p>
        </div>
        <Link
          href="/sorteios/novo"
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo sorteio
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        </div>
      ) : !sorteios?.length ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {sorteios.map((sorteio) => {
            const config = statusConfig[sorteio.status];
            const StatusIcon = config.icon;
            const totalComentarios = sorteio.posts.reduce(
              (sum, p) => sum + p.totalComentarios,
              0
            );

            return (
              <Link
                key={sorteio.id}
                href={`/sorteios/${sorteio.id}`}
                className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow flex items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {sorteio.posts[0]?.mediaUrl ? (
                    <img
                      src={sorteio.posts[0].mediaUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gift className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {sorteio.titulo}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{sorteio.posts.length} post(s)</span>
                    <span>{totalComentarios} comentários</span>
                    <span>{sorteio.qtdGanhadores} ganhador(es)</span>
                  </div>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {config.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
        <Gift className="w-8 h-8 text-brand-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhum sorteio ainda
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Crie seu primeiro sorteio e comece a sortear comentários do Instagram de forma auditável.
      </p>
      <Link
        href="/sorteios/novo"
        className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Criar primeiro sorteio
      </Link>
    </div>
  );
}
