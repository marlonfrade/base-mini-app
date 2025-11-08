"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useBlockNumber, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { PAYMENT_CONTRACT_ABI, PAYMENT_CONTRACT_ADDRESS } from "@/lib/contractABI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContractValidator() {
  const { address, isConnected, chain } = useAccount();
  const [testResults, setTestResults] = useState<any>({});
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const { 
    data: owner, 
    isError: ownerError,
    isLoading: ownerLoading,
    refetch: refetchOwner 
  } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getOwner",
  });

  const { 
    data: totalBatches, 
    isError: batchesError,
    isLoading: batchesLoading,
    refetch: refetchBatches 
  } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getTotalBatches",
  });

  const { 
    data: totalPayments, 
    isError: paymentsError,
    isLoading: paymentsLoading,
    refetch: refetchPayments 
  } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getTotalPayments",
  });

  const { 
    data: queuedCount, 
    isError: queuedError,
    isLoading: queuedLoading,
    refetch: refetchQueued 
  } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getQueuedCount",
  });

  useEffect(() => {
    setTestResults({
      owner: { data: owner, error: ownerError, loading: ownerLoading },
      batches: { data: totalBatches, error: batchesError, loading: batchesLoading },
      payments: { data: totalPayments, error: paymentsError, loading: paymentsLoading },
      queued: { data: queuedCount, error: queuedError, loading: queuedLoading },
    });
  }, [owner, ownerError, ownerLoading, totalBatches, batchesError, batchesLoading, totalPayments, paymentsError, paymentsLoading, queuedCount, queuedError, queuedLoading]);

  const refetchAll = () => {
    refetchOwner();
    refetchBatches();
    refetchPayments();
    refetchQueued();
    toast.info("Recarregando dados do contrato...");
  };

  const handleSwitchNetwork = () => {
    if (!switchChain) {
      toast.error("Função de trocar rede não disponível");
      return;
    }
    
    try {
      switchChain({ chainId: arbitrumSepolia.id });
      toast.success("Solicitação enviada! Aprove na carteira.");
    } catch (error: any) {
      toast.error("Erro ao trocar de rede: " + error.message);
    }
  };

  const serializeData = (data: any): string => {
    if (data === null || data === undefined) return '';
    if (typeof data === 'bigint') return data.toString();
    if (typeof data === 'object') {
      return JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    }
    return data.toString();
  };

  const TestRow = ({ label, result }: { label: string; result: any }) => {
    if (result.loading) {
      return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <span className="font-medium">{label}</span>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        </div>
      );
    }

    if (result.error) {
      return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <span className="font-medium">{label}</span>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <Badge variant="destructive">Erro</Badge>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div>
          <span className="font-medium">{label}</span>
          {result.data !== undefined && (
            <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
              {serializeData(result.data)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="bg-green-100 dark:bg-green-950">OK</Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 border-blue-500/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🔍 Validação de Contrato
              {blockNumber && (
                <Badge variant="secondary" className="font-mono text-xs">
                  Block #{blockNumber.toString()}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Testando conexão e leitura do smart contract
            </CardDescription>
          </div>
          <Button onClick={refetchAll} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status de Conexão</span>
            {isConnected ? (
              <Badge variant="outline" className="gap-1 bg-green-100 dark:bg-green-950">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 bg-red-100 dark:bg-red-950">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                Desconectado
              </Badge>
            )}
          </div>
          
          {isConnected && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Carteira:</span>
                <code className="bg-background px-2 py-1 rounded">
                  {address?.slice(0, 10)}...{address?.slice(-8)}
                </code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Rede:</span>
                <code className="bg-background px-2 py-1 rounded">
                  {chain?.name || "Unknown"} (ID: {chain?.id})
                </code>
              </div>
            </>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Contrato:</span>
            <code className="bg-background px-2 py-1 rounded">
              {PAYMENT_CONTRACT_ADDRESS.slice(0, 10)}...{PAYMENT_CONTRACT_ADDRESS.slice(-8)}
            </code>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Testes de Leitura do Contrato:</h3>
          
          <TestRow label="1. Dono do Contrato" result={testResults.owner || {}} />
          <TestRow label="2. Total de Lotes Executados" result={testResults.batches || {}} />
          <TestRow label="3. Total de Pagamentos Feitos" result={testResults.payments || {}} />
          <TestRow label="4. Pagamentos na Fila (Pending)" result={testResults.queued || {}} />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Diagnóstico:</strong>
            {!isConnected && " Conecte sua carteira para testar o contrato."}
            {isConnected && chain?.id !== 421614 && " Troque para a rede Arbitrum Sepolia para interagir com o contrato."}
            {isConnected && chain?.id === 421614 && (
              <>
                {Object.values(testResults).every((r: any) => !r.error && !r.loading) 
                  ? " ✅ Todas as funções do contrato estão respondendo corretamente!" 
                  : " ⚠️ Alguns testes falharam. Verifique se o contrato está implantado na Arbitrum Sepolia."}
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
