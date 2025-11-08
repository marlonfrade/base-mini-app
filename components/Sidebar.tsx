"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Clock, TrendingUp, Wallet, BarChart3 } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Usuários", href: "/users", icon: Users },
  { name: "Histórico", href: "/history", icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-4 py-6">
      {/* Logo section */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold">Onflow Chain</div>
            <div className="text-xs text-muted-foreground">Pagamentos Base</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-muted-foreground group-hover:text-accent-foreground"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stats card */}
      <div className="mt-auto space-y-4">
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg bg-green-500/10 p-1.5">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Total processado
            </span>
          </div>
          <div className="text-2xl font-bold">0 ETH</div>
          <div className="mt-1 text-xs text-muted-foreground">
            +0% este mês
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-medium mb-1">💡 Dica</p>
              <p className="text-muted-foreground leading-relaxed">
                Importe CSV para adicionar múltiplos pagamentos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
