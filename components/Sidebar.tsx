"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const Item = ({ href, label }: { href: string; label: string }) => {
    const active = pathname?.startsWith(href);
    return (
      <Button
        asChild
        variant={active ? "default" : "ghost"}
        className="justify-start"
      >
        <Link href={href}>{label}</Link>
      </Button>
    );
  };

  return (
    <aside className="p-4">
      <div className="mb-2 text-lg font-semibold">Onflow Chain</div>
      <Separator className="mb-4" />
      <div className="grid gap-2">
        <Item href="/dashboard" label="Dashboard" />
        <Item href="/users" label="Usuários" />
        <Item href="/history" label="Histórico" />
      </div>
    </aside>
  );
}
