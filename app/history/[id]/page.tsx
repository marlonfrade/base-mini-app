"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useHistoryStore } from "../../../lib/store";
import { Card } from "@/components/ui/card";

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const { detail, loadDetail } = useHistoryStore();

  useEffect(() => {
    if (params?.id) loadDetail(params.id);
  }, [params?.id, loadDetail]);

  if (!detail)
    return (
      <div className="p-4 text-sm text-muted-foreground">Carregando...</div>
    );

  return (
    <div className="grid gap-4 p-4">
      <div>
        <h2 className="text-xl font-semibold">Detalhes do Lote — Onflow Chain</h2>
        <p className="text-sm text-muted-foreground">
          ID: {detail.id} — Tx: {detail.txHash}
        </p>
      </div>
      <Card className="grid gap-2 p-4">
        <div>
          <strong>Data:</strong> {new Date(detail.date).toLocaleString()}
        </div>
        <div>
          <strong>Pagamentos:</strong> {detail.count}
        </div>
        <div>
          <strong>Gás:</strong> {detail.gasCostWei ?? "-"}
        </div>
        <div>
          <strong>Status:</strong> {detail.status}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Nome</th>
              <th className="p-3">Wallet</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {detail.recipients.map((r, idx) => (
              <tr key={idx}>
                <td className="p-3">{r.name ?? "-"}</td>
                <td className="p-3">{r.wallet}</td>
                <td className="p-3">{r.amount}</td>
                <td className="p-3">{r.status ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
