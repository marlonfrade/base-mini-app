import { isAddress } from "viem";
import type { PaymentRow } from "../types/payments";

export function isValidName(name: string): boolean {
  return typeof name === "string" && name.trim().length >= 2;
}

export function isValidAddress(addr: string): boolean {
  try {
    return isAddress(addr as `0x${string}`);
  } catch {
    return false;
  }
}

export function isValidAmount(amount: string): boolean {
  if (typeof amount !== "string") return false;
  if (!/^\d+(?:[.,]\d+)?$/.test(amount.trim())) return false;
  const normalized = amount.replace(",", ".");
  return Number(normalized) > 0;
}

export function validatePaymentRow(row: PaymentRow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isValidName(row.name)) errors.push("Nome inválido");
  if (!isValidAddress(row.wallet)) errors.push("Wallet inválida");
  if (!isValidAmount(row.amount)) errors.push("Valor inválido");
  return { valid: errors.length === 0, errors };
}

export function validateCSVHeaders(headers: string[]): { valid: boolean; errors: string[] } {
  const required = ["name", "wallet", "amount"];
  const lower = headers.map((h) => h.trim().toLowerCase());
  const missing = required.filter((r) => !lower.includes(r));
  return { valid: missing.length === 0, errors: missing.map((m) => `Coluna ausente: ${m}`) };
}





