"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useHistoryStore } from "../../lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  XCircle,
  History as HistoryIcon,
  ExternalLink,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function HistoryPage() {
  const items = useHistoryStore((s) => s.items);

  const stats = useMemo(() => {
    const confirmed = items.filter((i) => i.status === "confirmed").length;
    const failed = items.filter((i) => i.status === "failed").length;
    const pending = items.filter((i) => i.status === "pending").length;
    const totalTransactions = items.reduce((sum, i) => sum + i.count, 0);

    return { confirmed, failed, pending, totalTransactions };
  }, [items]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "destructive" | "secondary" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">
          Transparência onchain de todos os lotes executados
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
            <HistoryIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">execuções registradas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">lotes bem-sucedidos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">lotes com erro</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">pagamentos processados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            Registro completo de todas as execuções de lote
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">Sem registros no histórico</p>
              <p className="text-xs text-muted-foreground mt-1">
                Execute um lote de pagamentos para ver o histórico aqui
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((i, idx) => (
                <div
                  key={i.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary p-2">
                      {getStatusIcon(i.status)}
                    </div>
                    {idx < items.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            Lote #{items.length - idx}
                          </h3>
                          <Badge variant={getStatusVariant(i.status)}>
                            {i.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(i.date).toLocaleString("pt-BR", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <Link href={`/history/${i.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Ver detalhes
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Tx Hash:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {i.txHash.slice(0, 6)}...{i.txHash.slice(-4)}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Quantidade:</span>
                        <Badge variant="secondary">{i.count} pagamentos</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Gás:</span>
                        <span className="font-mono text-xs">
                          {i.gasCostWei ? `${i.gasCostWei} wei` : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
