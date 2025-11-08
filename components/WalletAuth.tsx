"use client";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Wallet, LogOut, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function WalletAuth() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      toast.success("Carteira conectada!", {
        description: `${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  }, [isConnected, address]);

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error("Erro ao conectar:", error);
      toast.error("Erro ao conectar carteira");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Carteira desconectada");
  };

  if (!mounted) {
    return null;
  }

  if (isConnected && address) {
    return (
      <Card className="border-2 border-green-500/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Autenticado</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Pronto para usar</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Carteira:</span>
              <code className="bg-background px-3 py-1.5 rounded font-mono text-xs">
                {address.slice(0, 8)}...{address.slice(-6)}
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rede:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {chain?.name || "Arbitrum Sepolia"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleDisconnect}
            >
              <LogOut className="h-4 w-4" />
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Conecte sua Carteira</CardTitle>
            <CardDescription className="mt-1">
              Autenticação Web3 via blockchain
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
              Escolha sua carteira preferida
            </p>
          </div>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full justify-between gap-2 h-12"
                variant={connector.name.includes("MetaMask") ? "default" : "outline"}
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  {connector.name}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {isPending && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Aguardando aprovação na carteira...
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>🔒 Conexão segura e descentralizada</p>
          <p>Seus fundos ficam sempre sob seu controle</p>
        </div>
      </CardContent>
    </Card>
  );
}
