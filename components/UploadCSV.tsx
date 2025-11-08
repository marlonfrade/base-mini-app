"use client";
import { useState } from "react";
import { parseCSVFile } from "../lib/parseCSV";
import { usePaymentsStore } from "../lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UploadCSV() {
  const [summary, setSummary] = useState<string>("");
  const addRows = usePaymentsStore((s) => s.setRows);
  const existing = usePaymentsStore((s) => s.rows);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { rows, errors } = await parseCSVFile(file);
    addRows([...existing, ...rows]);
    const ok = rows.length;
    const err = errors.length;
    const text = `${ok} linhas importadas${err ? `, ${err} erros` : ""}`;
    setSummary(text);
    if (ok) toast.success(text);
    if (err) toast.error(errors.slice(0, 5).join("; "));
  }

  return (
    <Card className="grid gap-2 p-4">
      <div className="text-sm font-medium">Importar CSV</div>
      <div className="flex items-center gap-2">
        <Input type="file" accept=".csv,.xlsx,.xls" onChange={onFile} />
        <Button type="button" variant="secondary" onClick={() => {}}>
          Upload
        </Button>
      </div>
      {summary && (
        <div className="text-xs text-muted-foreground">{summary}</div>
      )}
    </Card>
  );
}
