"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Instagram, Star, Facebook, Loader2 } from "lucide-react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "968329228959846",
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
      setSdkReady(true);
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/pt_BR/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.FB) {
      setSdkReady(true);
    }
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setError("Facebook SDK não carregou. Tente novamente.");
      return;
    }

    setLoading(true);
    setError("");

    window.FB.login(
      async (response: any) => {
        if (response.authResponse) {
          try {
            const res = await fetch("/api/auth/facebook-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID,
              }),
            });

            const data = await res.json();

            if (data.success) {
              router.push("/sorteios");
              router.refresh();
            } else {
              setError(data.error || "Erro ao fazer login");
              setLoading(false);
            }
          } catch {
            setError("Erro de conexão. Tente novamente.");
            setLoading(false);
          }
        } else {
          setError("Login cancelado.");
          setLoading(false);
        }
      },
      { scope: "email" }
    );
  };

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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleFacebookLogin}
            disabled={loading || !sdkReady}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#166FE5] transition-colors mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Facebook className="w-5 h-5" />
            )}
            {loading ? "Conectando..." : "Continuar com Facebook"}
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
          <Link href="/termos-de-uso" className="underline">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link href="/politica-de-privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
