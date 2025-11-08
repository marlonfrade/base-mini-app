"use client";
import { useEffect, useMemo, useState } from "react";
import { usePaymentsStore } from "../../lib/store";
import PaymentTable from "../../components/PaymentTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useHistoryStore } from "../../lib/store";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DashboardPage() {
  const estimate = usePaymentsStore((s) => s.estimateBatch);
  const execute = usePaymentsStore((s) => s.executeBatch);
  const rows = usePaymentsStore((s) => s.rows);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    items: historyItems,
    load: loadHistory,
    loading: historyLoading,
  } = useHistoryStore();
  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_SIZE = 10;

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const { pagedHistory, totalHistoryPages } = useMemo(() => {
    const start = (historyPage - 1) * HISTORY_PAGE_SIZE;
    const paged = historyItems.slice(start, start + HISTORY_PAGE_SIZE);
    const total = Math.max(
      1,
      Math.ceil(historyItems.length / HISTORY_PAGE_SIZE)
    );
    return { pagedHistory: paged, totalHistoryPages: total };
  }, [historyItems, historyPage]);

  async function onPay() {
    if (rows.length === 0) return;
    await estimate();
    setConfirmOpen(true);
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">Dashboard — Onflow Chain</h2>
        <p className="text-sm text-muted-foreground">
          Automatize pagamentos em lote e acompanhe sua tesouraria com
          transparência onchain. O upload de CSV está em Usuários.
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Pagamentos Programados</h3>
          <div className="text-sm text-muted-foreground">
            Edite, exclua ou antecipe itens individuais.
          </div>
        </div>
        <PaymentTable />
        <div className="sticky bottom-0 p-3 border-t bg-background">
          <div className="mx-auto w-full max-w-3xl">
            <Button
              className="w-full md:w-72"
              size="lg"
              onClick={onPay}
              disabled={rows.length === 0}
            >
              PAGAR
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Pagamentos Realizados</h3>
          <Button variant="outline" asChild>
            <Link href="/history">Ver histórico completo</Link>
          </Button>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-muted/50">
                <th className="p-3">Data</th>
                <th className="p-3">Tx Hash</th>
                <th className="p-3">Qtd</th>
                <th className="p-3">Gás</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {pagedHistory.map((i) => (
                <tr key={i.id}>
                  <td className="p-3">{new Date(i.date).toLocaleString()}</td>
                  <td className="p-3">{i.txHash}</td>
                  <td className="p-3">{i.count}</td>
                  <td className="p-3">{i.gasCostWei ?? "-"}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3 text-right">
                    <Link
                      className="text-sm underline"
                      href={`/history/${i.id}`}
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {historyLoading && (
                <tr>
                  <td colSpan={6} className="p-3">
                    <div className="w-full h-4 rounded animate-pulse bg-muted" />
                  </td>
                </tr>
              )}
              {historyItems.length === 0 && !historyLoading && (
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
          <div className="p-2">
            <Pagination>
              <PaginationContent className="justify-between w-full">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setHistoryPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={historyPage === 1}
                  />
                </PaginationItem>
                <div className="text-xs text-muted-foreground">
                  Página {historyPage} de {totalHistoryPages}
                </div>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setHistoryPage((p) => Math.min(totalHistoryPages, p + 1));
                    }}
                    aria-disabled={historyPage === totalHistoryPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento em lote</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a enviar {rows.length} pagamentos. Confirma?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const res = await execute();
                if (res) toast.success("Lote enviado: " + res.batchId);
              }}
            >
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
