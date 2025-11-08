"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useHistoryStore } from "../../../lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Users,
  DollarSign,
  Fuel,
  Calendar,
} from "lucide-react";

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const getDetail = useHistoryStore((s) => s.getDetail);
  const detail = params?.id ? getDetail(params.id) : undefined;

  if (!detail)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="h-16 w-16 text-muted-foreground opacity-20" />
        <p className="text-lg text-muted-foreground">Lote não encontrado</p>
        <Link href="/history">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao histórico
          </Button>
        </Link>
      </div>
    );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
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
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Link href="/history">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao histórico
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Lote</h1>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-3 py-1 rounded">
              {detail.txHash}
            </code>
            <Badge variant={getStatusVariant(detail.status)} className="gap-1">
              {getStatusIcon(detail.status)}
              {detail.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {new Date(detail.date).toLocaleDateString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(detail.date).toLocaleTimeString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detail.count}</div>
            <p className="text-xs text-muted-foreground">beneficiários</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {detail.recipients.reduce((sum, r) => sum + parseFloat(r.amount || "0"), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">USDC</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo de Gás</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {detail.gasCostWei ? `${detail.gasCostWei}` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">wei</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beneficiários</CardTitle>
          <CardDescription>
            Lista completa dos {detail.count} pagamentos neste lote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium">Wallet</th>
                  <th className="px-4 py-3 text-right font-medium">Valor</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {detail.recipients.map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{r.name || "-"}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {r.wallet.slice(0, 6)}...{r.wallet.slice(-4)}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {r.amount} USDC
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.status ? (
                        <Badge variant={getStatusVariant(r.status)}>
                          {r.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
