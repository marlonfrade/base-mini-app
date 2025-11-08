"use client";
import { useMemo, useState, useEffect } from "react";
import { usePaymentsStore } from "../lib/store";
import PaymentRow from "./PaymentRow";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function PaymentTable() {
  const rows = usePaymentsStore((state) => state.rows);
  const [page, setPage] = useState(1);
  const [localRows, setLocalRows] = useState(rows);

  useEffect(() => {
    setLocalRows([...rows]);
  }, [rows]);

  const { pageRows, totalPages } = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const pageRows = localRows.slice(start, start + PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(localRows.length / PAGE_SIZE));
    return { pageRows, totalPages };
  }, [localRows, page]);

  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="p-3">Nome</th>
            <th className="p-3">Wallet</th>
            <th className="p-3">Valor</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <PaymentRow key={r.id} row={r} />
          ))}
          {localRows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-muted-foreground">
                Nenhum item. Importe um CSV ou cadastre manualmente.
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
                  setPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={page === 1}
              />
            </PaginationItem>
            <div className="text-xs text-muted-foreground">
              Página {page} de {totalPages} ({localRows.length} total)
            </div>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
