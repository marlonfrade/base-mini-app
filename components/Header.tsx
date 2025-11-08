"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 py-3">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-base font-semibold">Onflow Chain</h1>
      <div className="ml-auto" />
      <MobileMenu open={open} onOpenChange={setOpen} />
    </header>
  );
}
