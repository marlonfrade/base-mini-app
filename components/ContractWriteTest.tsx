"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { PAYMENT_CONTRACT_ABI, PAYMENT_CONTRACT_ADDRESS } from "@/lib/contractABI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContractWriteTest() {
  const { address, isConnected, chain } = useAccount();
  const [depositAmount, setDepositAmount] = useState("0.001");
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error("Conecte sua carteira primeiro");
      return;
    }

    if (chain?.id !== 421614) {
      toast.error("Troque para a rede Arbitrum Sepolia (Chain ID: 421614)");
      return;
    }

    try {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Valor inválido");
        return;
      }

      toast.info("Enviando transação...");
      
      writeContract({
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: "deposit",
        value: parseEther(depositAmount),
      });
    } catch (err: any) {
      console.error("Erro ao depositar:", err);
      toast.error(err.message || "Erro ao depositar");
    }
  };

  // Show success message when transaction is confirmed
  if (isSuccess && hash) {
    return (
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Transação Confirmada!
          </CardTitle>
          <CardDescription>
            Seu depósito foi processado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-950">
                  {depositAmount} ETH
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">TX Hash:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {hash.slice(0, 10)}...{hash.slice(-8)}
                </code>
              </div>
              <a
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                Ver no BaseScan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="w-full"
          >
            Fazer Outro Depósito
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-500/50">
      <CardHeader>
        <CardTitle>🧪 Teste de Escrita no Contrato</CardTitle>
        <CardDescription>
          Faça um depósito de teste para validar a integração
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              Conecte sua carteira para testar transações
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Valor do Depósito (ETH)</Label>
              <Input
                id="depositAmount"
                type="number"
                step="0.001"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.001"
                disabled={isPending || isConfirming}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo recomendado: 0.001 ETH
              </p>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={isPending || isConfirming}
              className="w-full gap-2"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isPending ? "Aguardando aprovação..." : "Confirmando..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Depositar {depositAmount} ETH
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-900 dark:text-red-100">
                  <strong>Erro:</strong> {error.message}
                </p>
              </div>
            )}

            {hash && !isSuccess && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Aguardando confirmação...
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  TX: {hash.slice(0, 10)}...{hash.slice(-8)}
                </p>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
              <p><strong>ℹ️ O que este teste faz:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Envia ETH para o contrato (função deposit)</li>
                <li>Valida que você pode escrever no contrato</li>
                <li>Testa aprovação via MetaMask</li>
                <li>Aguarda confirmação na blockchain</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
