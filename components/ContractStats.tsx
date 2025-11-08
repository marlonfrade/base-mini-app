"use client";
import { usePaymentContract } from "@/lib/usePaymentContract";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Clock, CheckCircle2, User, ExternalLink } from "lucide-react";
import { formatEther } from "viem";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PAYMENT_CONTRACT_ADDRESS } from "@/lib/contractABI";
import Link from "next/link";

export default function ContractStats() {
  const { address, isConnected } = useAccount();
  const { 
    dashboardStats, 
    isPendingBatch, 
    dueDate,
    executePendingTransaction,
    refetchStats,
    isPending,
    isConfirming,
    isSuccess 
  } = usePaymentContract();

  const handleExecutePending = async () => {
    try {
      executePendingTransaction();
      toast.success("Transação enviada!");
    } catch (error) {
      toast.error("Erro ao executar transação");
      console.error(error);
    }
  };

  const formatDueDate = (timestamp: bigint | undefined) => {
    if (!timestamp) return "-";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString("pt-BR");
  };

  if (!dashboardStats || !isConnected) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <User className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Conecte sua carteira para ver estatísticas do contrato
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [queuedCount, queuedTotal, totalPayments, totalBatches] = dashboardStats;

  return (
    <div className="space-y-6">
      {/* Header Section - Contract & User Info Combined */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Contract Info */}
        <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-purple-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contrato Ativo</p>
                  <code className="text-xs font-mono bg-white/50 dark:bg-black/30 px-2 py-1 rounded">
                    {PAYMENT_CONTRACT_ADDRESS.slice(0, 8)}...{PAYMENT_CONTRACT_ADDRESS.slice(-6)}
                  </code>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href={`https://sepolia.arbiscan.io/address/${PAYMENT_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    ArbScan
                  </Button>
                </a>
                <Link href="/contract-debug">
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    🔬 Debug
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conta Conectada</p>
                  <code className="text-xs font-mono bg-white/50 dark:bg-black/30 px-2 py-1 rounded">
                    {address?.slice(0, 8)}...{address?.slice(-6)}
                  </code>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1.5 px-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs">Ativo</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Fila</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queuedCount?.toString() || "0"}</div>
            <p className="text-xs text-muted-foreground">pagamentos aguardando</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Fila</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queuedTotal ? formatEther(queuedTotal) : "0"} ETH
            </div>
            <p className="text-xs text-muted-foreground">total programado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments?.toString() || "0"}</div>
            <p className="text-xs text-muted-foreground">executados com sucesso</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBatches?.toString() || "0"}</div>
            <p className="text-xs text-muted-foreground">lotes processados</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Transaction Card */}
      {isPendingBatch && (
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-yellow-600" />
              Lote Pendente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data de Vencimento:</span>
                <span className="font-medium">{formatDueDate(dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pagamentos:</span>
                <span className="font-medium">{queuedCount?.toString() || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="font-medium">
                  {queuedTotal ? formatEther(queuedTotal) : "0"} ETH
                </span>
              </div>
            </div>
            <Button
              onClick={handleExecutePending}
              disabled={isPending || isConfirming}
              className="w-full"
            >
              {isPending || isConfirming ? "Executando..." : "Executar Agora"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetchStats()}>
          Atualizar Estatísticas
        </Button>
      </div>
    </div>
  );
}
