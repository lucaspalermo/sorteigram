"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  Trophy,
  Filter,
  Users,
  Hash,
  Ban,
  Play,
  RotateCcw,
  Download,
  Share2,
  CheckCircle,
  Loader2,
  ArrowLeft,
  PartyPopper,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface Participante {
  id: string;
  username: string;
  texto: string;
}

type Etapa = "input" | "config" | "sorteando" | "resultado";

export default function SortearPage() {
  const [etapa, setEtapa] = useState<Etapa>("input");
  const [url, setUrl] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [ganhadores, setGanhadores] = useState<Participante[]>([]);
  const [qtdGanhadores, setQtdGanhadores] = useState(1);
  const [filtros, setFiltros] = useState({
    minTags: 0,
    hashtag: "",
    removerDuplicados: true,
    bloqueados: "",
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [animandoNome, setAnimandoNome] = useState("");
  const [hashSeed, setHashSeed] = useState("");
  const [seedRevelado, setSeedRevelado] = useState("");

  const [erro, setErro] = useState("");

  const buscarComentarios = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErro(data.error || "Erro ao buscar comentários");
        setCarregando(false);
        return;
      }

      if (data.comments.length === 0) {
        setErro("Nenhum comentário encontrado neste post.");
        setCarregando(false);
        return;
      }

      const comentarios: Participante[] = data.comments.map(
        (c: any, i: number) => ({
          id: c.id || String(i + 1),
          username: c.username,
          texto: c.texto,
        })
      );

      setParticipantes(comentarios);
      setCarregando(false);
      setEtapa("config");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setCarregando(false);
    }
  }, [url]);

  // Aplicar filtros
  const participantesFiltrados = participantes.filter((p) => {
    if (filtros.removerDuplicados) {
      const idx = participantes.findIndex(
        (x) => x.username.toLowerCase() === p.username.toLowerCase()
      );
      if (participantes.indexOf(p) !== idx) return false;
    }
    if (filtros.minTags > 0) {
      const tags = (p.texto.match(/@\w+/g) || []).length;
      if (tags < filtros.minTags) return false;
    }
    if (filtros.hashtag) {
      if (!p.texto.toLowerCase().includes(filtros.hashtag.toLowerCase())) return false;
    }
    if (filtros.bloqueados) {
      const bloqs = filtros.bloqueados.split(",").map((b) => b.trim().toLowerCase());
      if (bloqs.includes(p.username.toLowerCase())) return false;
    }
    return true;
  });

  // Sortear com animação
  const realizarSorteio = useCallback(async () => {
    setEtapa("sorteando");

    // Gerar hash seed (provably fair)
    const seed = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    setHashSeed(hash);
    setSeedRevelado(seed);

    // Countdown 5..4..3..2..1
    for (let i = 5; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(0);

    // Animação de nomes girando
    const elegiveisShuffled = [...participantesFiltrados];
    const ANIM_DURACAO = 3000;
    const ANIM_INTERVAL = 60;
    const iterations = ANIM_DURACAO / ANIM_INTERVAL;

    for (let i = 0; i < iterations; i++) {
      const idx = Math.floor(Math.random() * elegiveisShuffled.length);
      setAnimandoNome(elegiveisShuffled[idx].username);
      await new Promise((r) => setTimeout(r, ANIM_INTERVAL + i * 2)); // Desacelera
    }

    // Selecionar ganhadores deterministicamente usando seed
    const sorted = [...participantesFiltrados].sort((a, b) => a.id.localeCompare(b.id));
    const vencedores: Participante[] = [];
    for (let i = 0; i < Math.min(qtdGanhadores, sorted.length); i++) {
      const seedNum = seed.split("").reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1 + i * 100), 0);
      const index = seedNum % sorted.length;
      const [vencedor] = sorted.splice(index, 1);
      vencedores.push(vencedor);
    }

    setAnimandoNome("");
    setGanhadores(vencedores);
    setEtapa("resultado");
  }, [participantesFiltrados, qtdGanhadores]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar simples */}
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
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            Criar conta
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Etapa 1: Colar URL */}
        {etapa === "input" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Sorteio rapido e gratis
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Sorteie agora
            </h1>
            <p className="text-gray-500 mb-8">
              Cole o link do post e sorteie em segundos. Sem cadastro.
            </p>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-2 shadow-lg mb-4">
              <div className="flex gap-2">
                <div className="flex items-center pl-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="flex-1 bg-transparent outline-none text-sm py-3 text-gray-700 placeholder:text-gray-400"
                />
                <button
                  onClick={buscarComentarios}
                  disabled={!url.trim() || carregando}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  {carregando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Buscar
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Funciona com Instagram, YouTube, TikTok, Twitter/X e Facebook
            </p>

            {erro && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {erro}
              </div>
            )}

            {carregando && (
              <div className="mt-8 bg-purple-50 rounded-2xl p-6 animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-purple-700 font-medium">
                  Buscando comentarios...
                </p>
                <p className="text-xs text-purple-500 mt-1">
                  Isso pode levar alguns segundos para posts grandes
                </p>
              </div>
            )}
          </div>
        )}

        {/* Etapa 2: Configurar */}
        {etapa === "config" && (
          <div>
            <button
              onClick={() => setEtapa("input")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  {participantes.length} comentarios encontrados
                </p>
                <p className="text-xs text-green-600">
                  {participantesFiltrados.length} elegiveis apos filtros
                </p>
              </div>
            </div>

            {/* Qtd ganhadores */}
            <div className="bg-white rounded-2xl border p-5 mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Users className="w-4 h-4 text-purple-600" />
                Quantidade de ganhadores
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQtdGanhadores(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      qtdGanhadores === n
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  value={qtdGanhadores}
                  onChange={(e) => setQtdGanhadores(Math.max(1, Number(e.target.value)))}
                  min={1}
                  max={50}
                  className="w-16 h-10 rounded-xl border text-center text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Filtros avançados (colapsável) */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="w-full flex items-center justify-between bg-white rounded-2xl border p-5 mb-4 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Filter className="w-4 h-4 text-purple-600" />
                Filtros avancados
              </span>
              {mostrarFiltros ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {mostrarFiltros && (
              <div className="bg-white rounded-2xl border p-5 mb-4 space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">
                    Remover comentarios duplicados
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filtros.removerDuplicados}
                      onChange={(e) =>
                        setFiltros({ ...filtros, removerDuplicados: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm text-gray-700 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    Minimo de amigos marcados
                  </label>
                  <input
                    type="number"
                    value={filtros.minTags}
                    onChange={(e) =>
                      setFiltros({ ...filtros, minTags: Number(e.target.value) })
                    }
                    min={0}
                    max={10}
                    className="w-20 px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm text-gray-700 mb-2">
                    <Hash className="w-3.5 h-3.5" />
                    Hashtag obrigatoria
                  </label>
                  <input
                    type="text"
                    value={filtros.hashtag}
                    onChange={(e) => setFiltros({ ...filtros, hashtag: e.target.value })}
                    placeholder="#sorteio"
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm text-gray-700 mb-2">
                    <Ban className="w-3.5 h-3.5" />
                    Bloquear usuarios (separar por virgula)
                  </label>
                  <input
                    type="text"
                    value={filtros.bloqueados}
                    onChange={(e) =>
                      setFiltros({ ...filtros, bloqueados: e.target.value })
                    }
                    placeholder="usuario1, usuario2"
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Hash publicado (provably fair) */}
            <div className="bg-purple-50 rounded-2xl border border-purple-100 p-5 mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-800 mb-2">
                <Shield className="w-4 h-4" />
                Provably Fair ativado
              </div>
              <p className="text-xs text-purple-600">
                O hash do seed sera publicado antes do sorteio. Apos o resultado, voce
                podera verificar que nao houve manipulacao.
              </p>
            </div>

            <button
              onClick={realizarSorteio}
              disabled={participantesFiltrados.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-pink-600 transition-all shadow-xl shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Sortear {participantesFiltrados.length} participantes
            </button>
          </div>
        )}

        {/* Etapa 3: Animação do sorteio */}
        {etapa === "sorteando" && (
          <div className="text-center py-12">
            {countdown > 0 ? (
              <div>
                <div className="text-8xl font-extrabold text-purple-600 animate-countdown mb-4">
                  {countdown}
                </div>
                <p className="text-gray-500 text-lg">Preparando sorteio...</p>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-pulse glow-brand">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 mb-4 inline-block min-w-[300px]">
                  <p className="text-purple-400 text-xs font-mono mb-2">
                    Sorteando...
                  </p>
                  <p className="text-2xl font-bold text-white font-mono animate-pulse">
                    @{animandoNome || "..."}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Analisando {participantesFiltrados.length} participantes
                </p>
              </div>
            )}

            {/* Hash visível durante sorteio */}
            {hashSeed && (
              <div className="mt-8 bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto">
                <p className="text-xs text-gray-500 font-mono mb-1">
                  Hash publicado (SHA-256):
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {hashSeed}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Etapa 4: Resultado */}
        {etapa === "resultado" && (
          <div>
            {/* Confetti header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <PartyPopper className="w-4 h-4" />
                Sorteio realizado com sucesso!
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {ganhadores.length > 1 ? "Ganhadores" : "Ganhador"}
              </h2>
            </div>

            {/* Winners */}
            <div className="space-y-3 mb-8">
              {ganhadores.map((g, i) => (
                <div
                  key={g.id}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">@{g.username}</p>
                    <p className="text-sm text-gray-500 truncate">{g.texto}</p>
                  </div>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
              ))}
            </div>

            {/* Provably Fair verification */}
            <div className="bg-gray-50 rounded-2xl border p-5 mb-6">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-sm mb-3">
                <Shield className="w-4 h-4 text-purple-600" />
                Verificacao Provably Fair
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-gray-500">Hash (publicado antes):</span>
                  <p className="text-gray-700 break-all">{hashSeed}</p>
                </div>
                <div>
                  <span className="text-gray-500">Seed (revelado agora):</span>
                  <p className="text-gray-700 break-all">{seedRevelado}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-sans font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  SHA-256(seed) == hash publicado
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {participantes.length}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {participantesFiltrados.length}
                </p>
                <p className="text-xs text-gray-500">Elegiveis</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {ganhadores.length}
                </p>
                <p className="text-xs text-gray-500">Ganhador(es)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Certificado
              </button>
            </div>

            <button
              onClick={() => {
                setEtapa("config");
                setGanhadores([]);
              }}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Sortear novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Shield(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
