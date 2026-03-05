"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Instagram, Search, Download, User } from "lucide-react";

export default function FotoPerfilPage() {
  const [username, setUsername] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const buscar = async () => {
    if (!username.trim()) return;
    setBuscando(true);
    // Em produção, chamaria API para buscar a foto HD
    await new Promise((r) => setTimeout(r, 1500));
    // Placeholder - em produção retornaria URL real
    setFotoUrl(`https://ui-avatars.com/api/?name=${username}&size=512&background=7c3aed&color=fff&bold=true`);
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
          <Link href="/ferramentas/story-viewer" className="text-sm text-purple-600 font-medium">
            Story Viewer →
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Foto de Perfil HD
        </h1>
        <p className="text-gray-500 mb-8">
          Visualize e baixe fotos de perfil do Instagram em alta resolucao. Gratis.
        </p>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-2 shadow-lg mb-8">
          <div className="flex gap-2">
            <div className="flex items-center pl-3 text-gray-400">@</div>
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
              className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {buscando && (
          <div className="animate-pulse">
            <div className="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
          </div>
        )}

        {fotoUrl && !buscando && (
          <div>
            <div className="relative inline-block mb-6">
              <img
                src={fotoUrl}
                alt={`@${username}`}
                className="w-48 h-48 rounded-full border-4 border-purple-200 shadow-xl"
              />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-4">@{username}</p>
            <a
              href={fotoUrl}
              download={`${username}-profile.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar em HD
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
