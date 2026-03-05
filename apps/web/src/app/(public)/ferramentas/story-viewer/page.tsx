"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Eye, Search, Instagram } from "lucide-react";

export default function StoryViewerPage() {
  const [username, setUsername] = useState("");
  const [buscando, setBuscando] = useState(false);

  const buscar = async () => {
    if (!username.trim()) return;
    setBuscando(true);
    await new Promise((r) => setTimeout(r, 1500));
    setBuscando(false);
  };

  return (
    <div className="min-h-screen bg-white">
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
          <Link href="/ferramentas/foto-perfil" className="text-sm text-purple-600 font-medium">
            Foto Perfil HD →
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Story Viewer Anonimo
        </h1>
        <p className="text-gray-500 mb-8">
          Veja stories do Instagram sem que a pessoa saiba. Totalmente anonimo e gratis.
        </p>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-2 shadow-lg mb-8">
          <div className="flex gap-2">
            <div className="flex items-center pl-3 text-gray-400">
              <Instagram className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace("@", ""))}
              placeholder="digite o username"
              className="flex-1 bg-transparent outline-none text-sm py-3 text-gray-700"
              onKeyDown={(e) => e.key === "Enter" && buscar()}
            />
            <button
              onClick={buscar}
              disabled={!username.trim() || buscando}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-orange-500 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Ver Stories
            </button>
          </div>
        </div>

        {buscando && (
          <div className="space-y-4 animate-pulse">
            <div className="flex gap-4 justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 h-40 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        )}

        {!buscando && !username && (
          <div className="bg-gray-50 rounded-2xl p-8">
            <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              Digite um username para ver os stories ativos
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Funciona apenas com contas publicas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
