"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from "wagmi";
import { parseEther, formatEther } from "viem";
import { PAYMENT_CONTRACT_ABI, PAYMENT_CONTRACT_ADDRESS } from "@/lib/contractABI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  AlertCircle, 
  Send, 
  ExternalLink,
  Wallet,
  Database,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ContractDebugPage() {
  const { address, isConnected, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [depositAmount, setDepositAmount] = useState("0.001");
  const [withdrawAmount, setWithdrawAmount] = useState("0.001");

  // Read functions
  const { data: owner, isError: ownerError, isLoading: ownerLoading, refetch: refetchOwner } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getOwner",
    });

  // Debug owner
  useEffect(() => {
    if (owner) {
      console.log("🔑 Owner do contrato:", owner);
      console.log("🔑 Tipo:", typeof owner);
      console.log("🔑 É endereço válido?", typeof owner === 'string' && owner.startsWith('0x'));
    }
  }, [owner]);

  const { data: totalSupply, isError: supplyError, isLoading: supplyLoading, refetch: refetchSupply } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getTotalSupply",
    });

  const { data: dashboardStats, isError: statsError, isLoading: statsLoading, refetch: refetchStats } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getDashboardStats",
    });

  const { data: isPending, isError: pendingError, isLoading: pendingLoading, refetch: refetchPending } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "isPending",
    });

  const { data: dueDate, isError: dueDateError, isLoading: dueDateLoading, refetch: refetchDueDate } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getDueDate",
    });

  const { data: queuedCount, refetch: refetchQueuedCount } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getQueuedCount",
    });

  const { data: queuedTotal, refetch: refetchQueuedTotal } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getQueuedTotal",
    });

  const { data: totalBatches, refetch: refetchTotalBatches } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getTotalBatches",
    });

  const { data: totalPayments, refetch: refetchTotalPayments } = 
    useReadContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "getTotalPayments",
    });

  // Write functions
  const { data: depositHash, writeContract: depositWrite, isPending: depositPending } = useWriteContract();
  const { isLoading: depositConfirming, isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  const { data: withdrawHash, writeContract: withdrawWrite, isPending: withdrawPending } = useWriteContract();
  const { isLoading: withdrawConfirming, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  const refetchAll = () => {
    refetchOwner();
    refetchSupply();
    refetchStats();
    refetchPending();
    refetchDueDate();
    refetchQueuedCount();
    refetchQueuedTotal();
    refetchTotalBatches();
    refetchTotalPayments();
    toast.info("Dados atualizados!");
  };

  useEffect(() => {
    if (depositSuccess) {
      toast.success("Depósito confirmado!");
      refetchAll();
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (withdrawSuccess) {
      toast.success("Saque confirmado!");
      refetchAll();
    }
  }, [withdrawSuccess]);

  const handleDeposit = () => {
    if (!isConnected) {
      toast.error("Conecte sua carteira");
      return;
    }
    if (chain?.id !== 421614) {
      toast.error("Troque para a rede Arbitrum Sepolia");
      return;
    }

    try {
      depositWrite({
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: "deposit",
        value: parseEther(depositAmount),
      });
      toast.info("Transação enviada!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleWithdraw = () => {
    if (!isConnected) {
      toast.error("Conecte sua carteira");
      return;
    }
    if (chain?.id !== 421614) {
      toast.error("Troque para a rede Arbitrum Sepolia");
      return;
    }

    try {
      withdrawWrite({
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: "withdraw",
        args: [parseEther(withdrawAmount)],
      });
      toast.info("Transação enviada!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const DataRow = ({ label, value, loading, error, isAddress = false }: any) => {
    const formatValue = () => {
      if (value === undefined || value === null) return "N/A";
      
      // Se é um endereço Ethereum
      if (isAddress && typeof value === 'string' && value.startsWith('0x')) {
        return `${value.slice(0, 6)}...${value.slice(-4)}`;
      }
      
      return value.toString();
    };

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm font-medium">{label}</span>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : error ? (
          <Badge variant="destructive">Erro</Badge>
        ) : isAddress && value ? (
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {formatValue()}
            </code>
            <a
              href={`https://sepolia.arbiscan.io/address/${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
            {formatValue()}
          </code>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🔬 Debug do Contrato
              </h1>
              <p className="text-muted-foreground mt-2">
                Página de testes e validação do smart contract
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  ← Dashboard
                </Button>
              </Link>
              <Button onClick={refetchAll} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="mb-6 border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status da Conexão
              {blockNumber && (
                <Badge variant="secondary" className="ml-auto font-mono">
                  Block #{blockNumber.toString()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Carteira</span>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {address?.slice(0, 10)}...{address?.slice(-8)}
                  </code>
                  <Badge variant="outline" className="gap-1 bg-green-100 dark:bg-green-950">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Conectado
                  </Badge>
                </div>
              ) : (
                <Badge variant="outline" className="gap-1 bg-red-100 dark:bg-red-950">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  Desconectado
                </Badge>
              )}
            </div>
            
            {isConnected && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rede</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {chain?.name || "Unknown"} (ID: {chain?.id})
                  </code>
                  {chain?.id === 421614 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contrato</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {PAYMENT_CONTRACT_ADDRESS.slice(0, 10)}...{PAYMENT_CONTRACT_ADDRESS.slice(-8)}
                </code>
                <a
                  href={`https://sepolia.arbiscan.io/address/${PAYMENT_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Read Functions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Leitura do Contrato
              </CardTitle>
              <CardDescription>Dados públicos da blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DataRow label="Owner" value={owner} loading={ownerLoading} error={ownerError} isAddress={true} />
              <DataRow label="Total Supply" value={totalSupply ? formatEther(totalSupply as bigint) + " ETH" : "0"} loading={supplyLoading} error={supplyError} />
              <DataRow label="Queued Count" value={queuedCount} loading={false} error={false} />
              <DataRow label="Queued Total" value={queuedTotal ? formatEther(queuedTotal as bigint) + " ETH" : "0"} loading={false} error={false} />
              <DataRow label="Total Batches" value={totalBatches} loading={false} error={false} />
              <DataRow label="Total Payments" value={totalPayments} loading={false} error={false} />
              <DataRow label="Is Pending" value={isPending ? "Sim" : "Não"} loading={pendingLoading} error={pendingError} />
              <DataRow label="Due Date" value={dueDate ? new Date(Number(dueDate) * 1000).toLocaleString() : "N/A"} loading={dueDateLoading} error={dueDateError} />
            </CardContent>
          </Card>

          {/* Dashboard Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Stats</CardTitle>
              <CardDescription>Estatísticas compiladas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : statsError ? (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    Erro ao carregar estatísticas
                  </p>
                </div>
              ) : dashboardStats ? (
                <>
                  <DataRow label="Queued Count" value={dashboardStats[0]?.toString()} loading={false} error={false} />
                  <DataRow label="Queued Total" value={formatEther(dashboardStats[1] as bigint) + " ETH"} loading={false} error={false} />
                  <DataRow label="Total Payments" value={dashboardStats[2]?.toString()} loading={false} error={false} />
                  <DataRow label="Total Batches" value={dashboardStats[3]?.toString()} loading={false} error={false} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sem dados disponíveis
                </p>
              )}
            </CardContent>
          </Card>

          {/* Deposit */}
          <Card className="border-2 border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Depositar ETH
              </CardTitle>
              <CardDescription>Enviar ETH para o contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Valor (ETH)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={depositPending || depositConfirming}
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={depositPending || depositConfirming || !isConnected || chain?.id !== 421614}
                className="w-full gap-2"
              >
                {depositPending || depositConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {depositPending ? "Aguardando..." : "Confirmando..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Depositar
                  </>
                )}
              </Button>
              {depositHash && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span>TX Hash:</span>
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${depositHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {depositHash.slice(0, 10)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Withdraw */}
          <Card className="border-2 border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Sacar ETH
              </CardTitle>
              <CardDescription>Retirar ETH do contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Valor (ETH)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  step="0.001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={withdrawPending || withdrawConfirming}
                />
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={withdrawPending || withdrawConfirming || !isConnected || chain?.id !== 421614}
                className="w-full gap-2"
                variant="destructive"
              >
                {withdrawPending || withdrawConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {withdrawPending ? "Aguardando..." : "Confirmando..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Sacar
                  </>
                )}
              </Button>
              {withdrawHash && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span>TX Hash:</span>
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${withdrawHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {withdrawHash.slice(0, 10)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          <p>
            Esta é uma página oculta de debug. Acesse via URL direta: 
            <code className="mx-2 bg-background px-2 py-1 rounded">/contract-debug</code>
          </p>
        </div>
      </div>
    </div>
  );
}
