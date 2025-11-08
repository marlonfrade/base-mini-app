"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, Laptop, Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import MobileMenu from "./MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Endereço copiado!");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Carteira desconectada");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Onflow Chain
              </h1>
              <p className="text-xs text-muted-foreground">Pagamentos em lote</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected && address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Wallet className="h-4 w-4" />
                  <code className="text-xs">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </code>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground mb-1">Endereço da carteira</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </code>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar endereço
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver no BaseScan
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Desconectar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-2 hidden sm:flex">
              <Link href="/login">
                <Wallet className="h-4 w-4" />
                Conectar
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <MobileMenu open={open} onOpenChange={setOpen} />
      </div>
    </header>
  );
}
