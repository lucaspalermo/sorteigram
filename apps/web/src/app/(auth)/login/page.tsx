"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Instagram, Star, Facebook } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-instagram-gradient flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">
              Sortei<span className="text-brand-600">Gram</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Entre na sua conta
          </h1>
          <p className="text-gray-600">
            Conecte seu Instagram para começar a sortear
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-8 shadow-sm">
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/sorteios" })}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#166FE5] transition-colors mb-4"
          >
            <Facebook className="w-5 h-5" />
            Continuar com Facebook
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                via Instagram Business
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-700">
              <Instagram className="w-4 h-4 inline mr-1" />
              Por que Facebook?
            </p>
            <p>
              A API oficial do Instagram requer login via Facebook para contas
              Business/Creator. Seus dados estão seguros.
            </p>
            <p>
              Precisamos de acesso aos seus <strong>posts</strong> e{" "}
              <strong>comentários</strong> apenas. Não publicamos nada.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
