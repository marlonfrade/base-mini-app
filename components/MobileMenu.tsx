"use client";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black text-white">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-base font-semibold">
            Navegação
          </DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-2 p-4">
          <Button asChild variant="ghost" onClick={() => onOpenChange(false)}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" onClick={() => onOpenChange(false)}>
            <Link href="/users">Usuários</Link>
          </Button>
          <Button asChild variant="ghost" onClick={() => onOpenChange(false)}>
            <Link href="/history">Histórico</Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
