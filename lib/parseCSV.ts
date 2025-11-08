import * as XLSX from "xlsx";
import type { ParseResult as PapaParseResult, ParseError } from "papaparse";
import type { PaymentRow } from "../types/payments";
import { validateCSVHeaders } from "./validators";

type ParseResult = { rows: PaymentRow[]; errors: string[] };

async function tryPapaparse(text: string): Promise<{ data: Record<string, unknown>[]; errors: ParseError[] } | null> {
  try {
    // Dynamically import papaparse if available. If not installed, fall back.
    const Papa = await import("papaparse");
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (res: PapaParseResult<Record<string, unknown>>) =>
          resolve({ data: res.data, errors: res.errors ?? [] }),
      });
    });
  } catch {
    return null;
  }
}

function buildRows(rawRows: Record<string, unknown>[]): { rows: PaymentRow[]; errors: string[] } {
  const rows: PaymentRow[] = [];
  const errors: string[] = [];

  rawRows.forEach((raw, idx) => {
    // Normalize keys to lowercase for robust mapping (supports Name/name/etc)
    const lower: Record<string, unknown> = {};
    Object.keys(raw).forEach((k) => {
      lower[k.trim().toLowerCase()] = (raw as Record<string, unknown>)[k];
    });

    const row: PaymentRow = {
      id: crypto.randomUUID(),
      name: String((lower["name"] ?? "") as string).trim(),
      wallet: String((lower["wallet"] ?? "") as string).trim(),
      amount: String((lower["amount"] ?? "") as string).trim(),
    };

    if (!row.name && !row.wallet && !row.amount) return;
    if (!row.name || !row.wallet || !row.amount) {
      errors.push(`Linha ${idx + 2}: campos obrigatórios ausentes`);
    }
    rows.push(row);
  });

  return { rows, errors };
}

async function parseWithXlsxFromArrayBuffer(buffer: ArrayBuffer): Promise<{ data: Record<string, unknown>[] }> {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { data: [] };
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];
  return { data };
}

async function parseCsvWithXlsxFromText(text: string): Promise<{ data: Record<string, unknown>[] }> {
  const workbook = XLSX.read(text, { type: "string" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { data: [] };
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];
  return { data };
}

export async function parseCSVFile(file: File): Promise<ParseResult> {
  const name = (file.name || "").toLowerCase();
  let parsed: { data: Record<string, unknown>[] } | null = null;
  const errors: string[] = [];

  try {
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const buffer = await file.arrayBuffer();
      parsed = await parseWithXlsxFromArrayBuffer(buffer);
    } else if (name.endsWith(".csv")) {
      const text = await file.text();
      // Prefer XLSX for consistency; fallback to Papa if needed
      try {
        parsed = await parseCsvWithXlsxFromText(text);
      } catch {
        parsed = (await tryPapaparse(text)) ?? { data: [] };
      }
    } else {
      // Unknown extension: try XLSX first, then PapaParse, then naive
      try {
        const buffer = await file.arrayBuffer();
        parsed = await parseWithXlsxFromArrayBuffer(buffer);
      } catch {
        const text = await file.text();
        parsed = (await tryPapaparse(text)) ?? { data: [] };
      }
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "desconhecido";
    errors.push("Falha ao ler arquivo: " + message);
    parsed = { data: [] };
  }

  const first = parsed.data[0] ?? {};
  const headers = Object.keys(first);
  const headerCheck = validateCSVHeaders(headers);
  if (!headerCheck.valid) return { rows: [], errors: [...errors, ...headerCheck.errors] };

  const built = buildRows(parsed.data as Record<string, unknown>[]);
  return { rows: built.rows, errors: [...errors, ...built.errors] };
}