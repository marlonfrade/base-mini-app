"use client";
import { useState, useRef, DragEvent } from "react";
import { parseCSVFile } from "../lib/parseCSV";
import { usePaymentsStore } from "../lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PaymentRow } from "../types/payments";
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadCSV() {
  const [summary, setSummary] = useState<string>("");
  const addMultipleRows = usePaymentsStore((s) => s.addMultipleRows);
  const [previewRows, setPreviewRows] = useState<PaymentRow[] | null>(null);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setProcessing(true);
    const { rows, errors } = await parseCSVFile(file);
    setPreviewRows(rows);
    setPreviewErrors(errors);
    setSummary(`${rows.length} linha${rows.length !== 1 ? 's' : ''} pronta${rows.length !== 1 ? 's' : ''} para importação`);
    if (errors.length) {
      toast.error(`${errors.length} erro${errors.length !== 1 ? 's' : ''} encontrado${errors.length !== 1 ? 's' : ''}`);
    }
    setProcessing(false);
  }

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  function onDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.name.match(/\\.(csv|xlsx|xls)$/i)) {
      toast.error("Formato inválido. Use CSV, XLSX ou XLS");
      return;
    }

    await handleFile(file);
  }

  function confirmImport() {
    if (!previewRows) return;
    addMultipleRows(previewRows);
    
    setTimeout(() => {
      const current = usePaymentsStore.getState().rows;
      console.log("✅ Após importar, store tem:", current.length, "pagamentos");
    }, 100);
    
    toast.success(`${previewRows.length} pagamento${previewRows.length !== 1 ? 's' : ''} importado${previewRows.length !== 1 ? 's' : ''} com sucesso!`);
    setPreviewRows(null);
    setPreviewErrors([]);
    setSummary("");
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function cancelPreview() {
    setPreviewRows(null);
    setPreviewErrors([]);
    setSummary("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-2 border-dashed transition-all hover:border-primary/50">
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn(
            "relative p-8 transition-colors",
            isDragging && "bg-primary/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={onFileSelect}
            className="hidden"
            id="csv-upload"
          />

          <div className="flex flex-col items-center text-center">
            <div className={cn(
              "mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all",
              isDragging 
                ? "bg-primary/20 scale-110" 
                : "bg-primary/10"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-primary/70"
              )} />
            </div>

            <h3 className="mb-2 text-lg font-semibold">
              {isDragging ? "Solte o arquivo aqui" : "Importar CSV"}
            </h3>
            
            <p className="mb-4 text-sm text-muted-foreground">
              Arraste e solte ou{" "}
              <label htmlFor="csv-upload" className="cursor-pointer font-medium text-primary hover:underline">
                selecione um arquivo
              </label>
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Suporta CSV, XLSX, XLS</span>
            </div>
          </div>
        </div>
      </Card>

      {summary && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-600 dark:text-blue-400">{summary}</span>
        </div>
      )}

      {previewErrors.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{previewErrors.length} erro{previewErrors.length !== 1 ? 's' : ''} encontrado{previewErrors.length !== 1 ? 's' : ''}</span>
          </div>
          <ul className="space-y-1 text-xs text-red-600/80 dark:text-red-400/80">
            {previewErrors.slice(0, 5).map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {previewRows && previewRows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/50 px-4 py-3">
            <h4 className="font-semibold">Preview ({previewRows.length} linha{previewRows.length !== 1 ? 's' : ''})</h4>
          </div>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/30">
                <tr className="border-b text-left">
                  <th className="p-3 font-medium">Nome</th>
                  <th className="p-3 font-medium">Wallet</th>
                  <th className="p-3 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 100).map((r, idx) => (
                  <tr key={r.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-3">{r.name}</td>
                    <td className="p-3 font-mono text-xs">{r.wallet}</td>
                    <td className="p-3 font-semibold">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 border-t bg-muted/20 p-4">
            <Button
              onClick={confirmImport}
              disabled={processing}
              className="flex-1"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar importação
            </Button>
            <Button onClick={cancelPreview} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
