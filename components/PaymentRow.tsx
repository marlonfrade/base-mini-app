"use client";
import { useState } from "react";
import type { PaymentRow as Row } from "../types/payments";
import { usePaymentsStore } from "../lib/store";
import { validatePaymentRow } from "../lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit2, Trash2, Zap, Check, X } from "lucide-react";
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
    toast.success("Pagamento atualizado");
  }

  function onCancel() {
    setDraft(row);
    setEditing(false);
  }

  return (
    <tr className="group hover:bg-muted/30 transition-colors">
      <td className="p-3">
        {editing ? (
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="h-8"
            placeholder="Nome"
          />
        ) : (
          <span className="font-medium">{row.name}</span>
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <Input
            value={draft.wallet}
            onChange={(e) => setDraft({ ...draft, wallet: e.target.value })}
            className="h-8 font-mono text-xs"
            placeholder="0x..."
          />
        ) : (
          <span className="font-mono text-xs text-muted-foreground">{row.wallet}</span>
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <Input
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
            className="h-8"
            placeholder="0.00"
          />
        ) : (
          <span className="font-semibold">{row.amount}</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-1">
          {editing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8"
              >
                <Check className="h-4 w-4 mr-1" />
                Salvar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
                className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRow(row.id)}
                className="h-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
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
                  if (res) toast.success("Pagamento enviado! Tx: " + res.txHash);
                }}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}
