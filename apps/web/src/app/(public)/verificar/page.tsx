"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Trophy,
  ShieldCheck,
  ShieldX,
  ArrowRight,
} from "lucide-react";

export default function VerificarPage() {
  const [codigo, setCodigo] = useState("");
  const [seed, setSeed] = useState("");
  const [hash, setHash] = useState("");
  const [resultado, setResultado] = useState<"valido" | "invalido" | null>(null);
  const [verificando, setVerificando] = useState(false);

  const verificar = async () => {
    if (!seed || !hash) return;
    setVerificando(true);
    // Calcular SHA-256 do seed
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculado = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setResultado(calculado === hash.trim() ? "valido" : "invalido");
    setVerificando(false);
  };

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

      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Verificar Sorteio
        </h1>
        <p className="text-gray-500 mb-10">
          Confirme que um sorteio do SorteiGram foi justo usando o hash criptografico.
        </p>

        <div className="bg-white rounded-2xl border p-6 text-left space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Hash publicado (antes do sorteio)
            </label>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="a3f8c2d1e5..."
              className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Seed revelado (apos o sorteio)
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="7b2d4e9f..."
              className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={verificar}
            disabled={!seed || !hash || verificando}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Verificar
            <ArrowRight className="w-4 h-4" />
          </button>

          {resultado === "valido" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
              <div className="text-left">
                <p className="font-bold text-green-800 text-sm">Sorteio valido!</p>
                <p className="text-xs text-green-600">
                  SHA-256(seed) corresponde ao hash publicado. O resultado nao foi manipulado.
                </p>
              </div>
            </div>
          )}
          {resultado === "invalido" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <ShieldX className="w-6 h-6 text-red-600 shrink-0" />
              <div className="text-left">
                <p className="font-bold text-red-800 text-sm">Hash nao confere!</p>
                <p className="text-xs text-red-600">
                  O seed nao produz o hash esperado. O sorteio pode ter sido alterado.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
