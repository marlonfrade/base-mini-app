"use client";
import { useState } from "react";
import type { PaymentRow as Row } from "../types/payments";
import { usePaymentsStore } from "../lib/store";
import { validatePaymentRow } from "../lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

export default function PaymentRow({ row }: { row: Row }) {
  const updateRow = usePaymentsStore((s) => s.updateRow);
  const removeRow = usePaymentsStore((s) => s.removeRow);
  const executeSingle = usePaymentsStore((s) => s.executeSingle);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Row>(row);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function onSave() {
    const res = validatePaymentRow(draft);
    if (!res.valid) {
      setErrors(res.errors);
      toast.error(res.errors.join(", "));
      return;
    }
    updateRow(row.id, draft);
    setEditing(false);
  }

  return (
    <tr>
      <td>
        {editing ? (
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        ) : (
          row.name
        )}
      </td>
      <td>
        {editing ? (
          <Input
            value={draft.wallet}
            onChange={(e) => setDraft({ ...draft, wallet: e.target.value })}
          />
        ) : (
          row.wallet
        )}
      </td>
      <td>
        {editing ? (
          <Input
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
          />
        ) : (
          row.amount
        )}
      </td>
      <td className="actions">
        {!editing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              Antecipar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeRow(row.id)}
            >
              Excluir
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Antecipar este pagamento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Este envio será processado imediatamente como um lote unitário.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const res = await executeSingle(row);
                      if (res) toast.success("Pagamento antecipado. Lote: " + res.batchId);
                    }}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <Button size="sm" onClick={onSave}>
              Salvar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </>
        )}
      </td>
      {errors.length > 0 && (
        <td colSpan={4} className="text-error">
          {errors.join(", ")}
        </td>
      )}
    </tr>
  );
}
