"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import WalletAuth from "@/components/WalletAuth";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      router.push("/dashboard");
    }
  }, [isConnected, address, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sistema de Pagamentos Base
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plataforma descentralizada para gerenciamento de pagamentos em blockchain
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Side - Features */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Segurança Blockchain</h3>
                    <p className="text-sm text-muted-foreground">
                      Todas as transações são registradas de forma imutável na blockchain Base,
                      garantindo transparência e segurança total.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Pagamentos Instantâneos</h3>
                    <p className="text-sm text-muted-foreground">
                      Envie pagamentos em lote para múltiplos beneficiários com apenas uma transação,
                      economizando tempo e taxas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-950 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Controle Total</h3>
                    <p className="text-sm text-muted-foreground">
                      Você mantém controle total sobre seus fundos através da sua carteira Web3.
                      Sem intermediários, sem custódia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Contrato verificado</p>
                    <code className="text-xs bg-white/20 px-2 py-1 rounded">
                      0x38dc15ea...ff9bf0c
                    </code>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Rede</p>
                    <p className="font-semibold">Base Chain</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth */}
            <div className="sticky top-8">
              <WalletAuth />
              
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Primeira vez aqui?
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Ao conectar sua carteira, você terá acesso ao dashboard de pagamentos e
                      poderá enviar transações para a blockchain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>
                  Ao conectar, você concorda com nossos{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Termos de Uso
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
