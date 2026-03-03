"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Instagram,
  Hash,
  Users,
  Loader2,
  Check,
  ImageIcon,
  Gift,
} from "lucide-react";
import Link from "next/link";

export default function NovoSorteioPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const [step, setStep] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [qtdGanhadores, setQtdGanhadores] = useState(1);
  const [regras, setRegras] = useState({
    seguir: false,
    marcarAmigos: 0,
    hashtag: "",
    textoObrigatorio: "",
  });
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const { data: posts, isLoading: loadingPosts } = useQuery(
    trpc.instagram.meusPostsRecentes.queryOptions()
  );

  const criarSorteio = useMutation(
    trpc.sorteio.criar.mutationOptions({
      onSuccess: (data) => {
        router.push(`/sorteios/${data.id}`);
      },
    })
  );

  const handleSubmit = () => {
    criarSorteio.mutate({
      titulo,
      qtdGanhadores,
      regras,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/sorteios"
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos sorteios
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Novo Sorteio</h1>
      <p className="text-gray-600 mb-8">Configure seu sorteio em poucos passos</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s === step
                  ? "bg-brand-600 text-white"
                  : s < step
                    ? "bg-brand-100 text-brand-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${s < step ? "bg-brand-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Info básica */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do sorteio
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Sorteio de Natal 2026"
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Quantidade de ganhadores
            </label>
            <input
              type="number"
              value={qtdGanhadores}
              onChange={(e) => setQtdGanhadores(Number(e.target.value))}
              min={1}
              max={50}
              className="w-24 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!titulo.trim()}
            className="w-full bg-brand-600 text-white py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo: Regras
          </button>
        </div>
      )}

      {/* Step 2: Regras */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-instagram-pink" />
              <div>
                <p className="text-sm font-medium">Deve seguir o perfil</p>
                <p className="text-xs text-gray-500">Verificação manual após sorteio</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={regras.seguir}
                onChange={(e) => setRegras({ ...regras, seguir: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Marcar quantos amigos? (0 = desativado)
            </label>
            <input
              type="number"
              value={regras.marcarAmigos}
              onChange={(e) =>
                setRegras({ ...regras, marcarAmigos: Number(e.target.value) })
              }
              min={0}
              max={10}
              className="w-24 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Hashtag obrigatória (opcional)
            </label>
            <input
              type="text"
              value={regras.hashtag}
              onChange={(e) => setRegras({ ...regras, hashtag: e.target.value })}
              placeholder="#sorteio"
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              Próximo: Selecionar posts
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Selecionar posts */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border p-6 space-y-6">
          <p className="text-sm text-gray-600">
            Selecione o(s) post(s) do sorteio. Os comentários serão importados automaticamente.
          </p>

          {loadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="ml-2 text-gray-600">Carregando posts...</span>
            </div>
          ) : !posts?.data?.length ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Nenhum post encontrado. Conecte sua conta Instagram Business.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {posts.data.map((post) => {
                const isSelected = selectedPosts.includes(post.id);
                return (
                  <button
                    key={post.id}
                    onClick={() =>
                      setSelectedPosts((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== post.id)
                          : [...prev, post.id]
                      )
                    }
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? "border-brand-600 ring-2 ring-brand-200" : "border-transparent"
                    }`}
                  >
                    {post.media_url ? (
                      <img
                        src={post.media_url}
                        alt={post.caption || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-600/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    {post.comments_count !== undefined && (
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {post.comments_count}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={criarSorteio.isPending || !titulo.trim()}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {criarSorteio.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Gift className="w-4 h-4" />
              )}
              Criar sorteio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
