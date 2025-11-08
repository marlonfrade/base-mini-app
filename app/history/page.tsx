"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useHistoryStore } from "../../lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { items, load, loading } = useHistoryStore();
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">Histórico — Onflow Chain</h2>
        <p className="text-sm text-muted-foreground">Transparência onchain de todos os lotes executados.</p>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Data</th>
              <th className="p-3">Tx Hash</th>
              <th className="p-3">Qtd</th>
              <th className="p-3">Gás</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="p-3">{new Date(i.date).toLocaleString()}</td>
                <td className="p-3">{i.txHash}</td>
                <td className="p-3">{i.count}</td>
                <td className="p-3">{i.gasCostWei ?? "-"}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      i.status === "confirmed"
                        ? "default"
                        : i.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {i.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Link className="text-sm underline" href={`/history/${i.id}`}>
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={6} className="p-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </td>
              </tr>
            )}
            {items.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  Sem registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
