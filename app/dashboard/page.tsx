"use client";
import { useEffect, useMemo, useState } from "react";
import { usePaymentsStore, useHistoryStore } from "../../lib/store";
import PaymentTable from "../../components/PaymentTable";
import ContractStats from "../../components/ContractStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { TrendingUp, Users, Clock, Zap, ArrowUpRight, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/AuthGuard";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI } from "@/lib/contractABI";
import { parseEther } from "viem";
import { cn } from "@/lib/utils";
import { migrateLocalStorage } from "@/lib/migrateAddresses";

function DashboardContent() {
  const estimate = usePaymentsStore((s) => s.estimateBatch);
  const rows = usePaymentsStore((s) => s.rows);
  const estimateData = usePaymentsStore((s) => s.estimate);
  const clearRows = usePaymentsStore((s) => s.clear);
  const loadMockData = usePaymentsStore((s) => s.loadMockData);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const historyItems = useHistoryStore((s) => s.items);
  const addExecution = useHistoryStore((s) => s.addExecution);
  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_SIZE = 5;
  const [migrationDone, setMigrationDone] = useState(false);
  
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!migrationDone) {
      const success = migrateLocalStorage();
      setMigrationDone(true);
      if (success) {
        console.log("✅ Verificação de endereços concluída");
      }
    }
  }, [migrationDone]);

  useEffect(() => {
    if (rows.length > 0) {
      console.log("📊 Rows atuais:", rows.map(r => ({ name: r.name, amount: r.amount, wallet: r.wallet })));
      estimate();
    }
  }, [rows, estimate]);

  useEffect(() => {
    if (rows.length > 0) {
      const hasCorruptedData = rows.some(row => 
        !row.wallet?.startsWith('0x') || 
        row.wallet?.includes('e+') ||
        row.wallet?.length !== 42
      );
      
      if (hasCorruptedData) {
        console.error("🚨 Dados corrompidos detectados! Limpando...");
        clearRows();
        localStorage.removeItem('payments-storage');
        toast.error("Dados corrompidos detectados. Por favor, carregue os dados de teste novamente.");
      }
    }
  }, [rows, clearRows]);

  const { pagedHistory, totalHistoryPages } = useMemo(() => {
    const start = (historyPage - 1) * HISTORY_PAGE_SIZE;
    const paged = historyItems.slice(start, start + HISTORY_PAGE_SIZE);
    const total = Math.max(
      1,
      Math.ceil(historyItems.length / HISTORY_PAGE_SIZE)
    );
    return { pagedHistory: paged, totalHistoryPages: total };
  }, [historyItems, historyPage]);

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(`Lote executado! Tx: ${hash}`);
      
      addExecution({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        txHash: hash,
        count: rows.length,
        status: "confirmed",
        recipients: rows.map((r) => ({
          name: r.name,
          wallet: r.wallet,
          amount: r.amount,
        })),
      });
      
      clearRows();
      setConfirmOpen(false);
    }
  }, [isSuccess, hash, rows, addExecution, clearRows]);

  useEffect(() => {
    if (writeError) {
      toast.error("Erro ao executar lote: " + writeError.message);
      setConfirmOpen(false);
    }
  }, [writeError]);

  async function onPay() {
    if (rows.length === 0) return;
    estimate();
    setConfirmOpen(true);
  }

  async function executePayment() {
    if (!isConnected) {
      toast.error("Conecte sua carteira primeiro");
      return;
    }

    try {
      const wallets = rows.map(r => r.wallet as `0x${string}`);
      const amounts = rows.map(r => parseEther(r.amount));
      const totalValue = amounts.reduce((acc, val) => acc + val, BigInt(0));

      if (chain?.id !== 421614) {
        toast.warning("A carteira pedirá para trocar para Arbitrum Sepolia");
      } else {
        toast.info("Enviando transação...");
      }

      writeContract({
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: "sendFuncionarios",
        args: [wallets, amounts, totalValue],
      });
    } catch (error: any) {
      toast.error("Erro: " + error.message);
      setConfirmOpen(false);
    }
  }

  const stats = useMemo(() => {
    const totalScheduled = rows.length;
    const totalValue = rows.reduce((acc, r) => {
      const val = parseFloat(r.amount || '0');
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    const totalExecuted = historyItems.reduce((acc, h) => acc + h.count, 0);
    const recentExecutions = historyItems.slice(0, 3);

    return { totalScheduled, totalValue, totalExecuted, recentExecutions };
  }, [rows, historyItems]);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral dos seus pagamentos em lote
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Dados Locais</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScheduled}</div>
              <p className="text-xs text-muted-foreground">
                pagamentos aguardando
              </p>
            </CardContent>
          </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalValue.toFixed(4)} ETH</div>
            <p className="text-xs text-muted-foreground">
              programado para envio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecuted}</div>
            <p className="text-xs text-muted-foreground">
              pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Histórico</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyItems.length}</div>
            <p className="text-xs text-muted-foreground">
              lotes executados
            </p>
          </CardContent>
        </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pagamentos Programados</CardTitle>
              <CardDescription>
                Gerencie seus pagamentos pendentes
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {estimateData && (
                <div className="text-right">
                  <p className="text-sm font-medium">Total Estimado</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    parseFloat(estimateData.totalAmount) > 10 ? "text-red-500" : "text-green-600"
                  )}>
                    {estimateData.totalAmount} ETH
                  </p>
                  {parseFloat(estimateData.totalAmount) > 10 && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Valor muito alto! Limpe e reimporte o CSV
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentTable />
          {rows.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                size="lg"
                onClick={onPay}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Executar Lote ({rows.length} pagamentos)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Últimas execuções de lote
              </CardDescription>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href="/history" className="gap-2">
                Ver tudo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentExecutions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentExecutions.map((item) => (
                <Link
                  key={item.id}
                  href={`/history/${item.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium font-mono">{item.txHash.slice(0, 20)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.count} pagamentos</p>
                      <Badge
                        variant={
                          item.status === "confirmed"
                            ? "default"
                            : item.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium">Nenhuma transação ainda</p>
              <p className="text-xs text-muted-foreground">
                Seus lotes executados aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento em lote</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a enviar {rows.length} pagamentos totalizando {estimateData?.totalAmount} ETH.
              {!isConnected && " Conecte sua carteira para continuar."}
              {isConnected && chain?.id !== 421614 && " A carteira pedirá para trocar para Arbitrum Sepolia."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending || isConfirming}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executePayment}
              disabled={isPending || isConfirming || !isConnected}
            >
              {isPending ? "Aguardando aprovação..." : isConfirming ? "Confirmando..." : "Enviar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
