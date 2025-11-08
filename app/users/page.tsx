"use client";
import { useEffect, useMemo, useState } from "react";
import { useUsersStore } from "../../lib/store";
import UserModal from "../../components/UserModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadCSV from "../../components/UploadCSV";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { items, load, remove, create, update, loading } = useUsersStore();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const editingUser = items.find((u) => u.id === editId);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Usuários — Onflow Chain</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre recebedores com wallet e valor padrão para lotes de pagamentos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditId(null);
            setOpen(true);
          }}
        >
          Criar Usuário
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Nome</th>
              <th className="p-3">Wallet</th>
              <th className="p-3">Valor padrão</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.id}>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.wallet}</td>
                <td className="p-3">{u.defaultAmount ?? "-"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditId(u.id);
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(u.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className="p-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </td>
              </tr>
            )}
            {items.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-muted-foreground"
                >
                  Nenhum usuário
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
                Página {page} de {totalPages}
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

      <div className="grid gap-2">
        <div>
          <h3 className="text-lg font-semibold">Importar CSV para Pagamentos</h3>
          <p className="text-sm text-muted-foreground">
            Importe um CSV para popular sua lista de pagamentos programados em minutos.
          </p>
        </div>
        <UploadCSV />
      </div>

      <UserModal
        open={open}
        mode={editId ? "edit" : "create"}
        initialData={editingUser ?? undefined}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          if (editId) await update(editId, data);
          else await create(data);
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) await remove(deleteId);
                setDeleteId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
