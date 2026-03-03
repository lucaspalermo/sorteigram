"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Star,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/sorteios", label: "Sorteios", icon: Gift },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardNav({ user }: { user: { name?: string | null; image?: string | null } }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/sorteios" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-instagram-gradient flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">
                Sortei<span className="text-brand-600">Gram</span>
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sorteios/novo"
              className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo sorteio</span>
            </Link>

            <div className="flex items-center gap-2">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-500 hover:text-gray-700 p-2"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
