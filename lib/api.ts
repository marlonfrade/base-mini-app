// Client-side only utilities for onchain interactions
// No backend API - all state managed client-side with zustand persist

import type {
  PaymentRow,
  BatchEstimate,
  BatchExecuteResult,
} from "../types/payments";

export function estimateBatch(rows: PaymentRow[]): BatchEstimate {
  
  const total = rows.reduce((acc, r) => {
    const n = parseFloat(String(r.amount ?? "0").replace(/[^0-9.-]/g, "")) || 0;
    return acc + n;
  }, 0);
  
  return {
    totalAmount: total.toFixed(4),
    recipients: rows.map((r) => r.wallet),
    amounts: rows.map((r) => r.amount),
    estGasWei: undefined,
    estGasFiat: undefined,
  };
}

export async function executeBatchOnchain(
  rows: PaymentRow[],
  estimate?: BatchEstimate
): Promise<BatchExecuteResult> {
  throw new Error("executeBatchOnchain should be called from a component with wagmi hooks");
}






