"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { User } from "../types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Partial<User>;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    wallet: string;
    defaultAmount?: string;
  }) => Promise<void> | void;
};

export default function UserModal({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
}: Props) {
  const { register, handleSubmit, reset } = useForm<{
    name: string;
    wallet: string;
    defaultAmount?: string;
  }>({
    defaultValues: { name: "", wallet: "", defaultAmount: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        wallet: initialData?.wallet ?? "",
        defaultAmount: initialData?.defaultAmount ?? "",
      });
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Usuário" : "Editar Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            await onSubmit({
              ...data,
              defaultAmount: data.defaultAmount || undefined,
            });
            onOpenChange(false);
          })}
          className="grid gap-3"
        >
          <div className="grid gap-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome"
              {...register("name")}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="wallet">Wallet</Label>
            <Input
              id="wallet"
              placeholder="0x..."
              {...register("wallet")}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="defaultAmount">Valor padrão (opcional)</Label>
            <Input
              id="defaultAmount"
              placeholder="0.00"
              {...register("defaultAmount")}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
