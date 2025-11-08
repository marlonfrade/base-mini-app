export interface PaymentRow {
  id: string;
  name: string;
  wallet: string;
  amount: string;
  meta?: Record<string, unknown>;
}

export interface BatchEstimate {
  totalAmount: string;
  estGasWei?: string;
  estGasFiat?: string;
  recipients: string[];
  amounts: string[];
}

export interface BatchExecuteResult {
  batchId: string;
  txHash: string;
  status: "pending" | "confirmed" | "failed";
}

export interface HistoryItem {
  id: string;
  date: string;
  txHash: string;
  count: number;
  gasCostWei?: string;
  status: "pending" | "confirmed" | "failed";
}

export interface HistoryDetail extends HistoryItem {
  recipients: { name?: string; wallet: string; amount: string; status?: "success" | "failed" }[];
}






