import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../types/user";
import type {
  PaymentRow,
  BatchEstimate,
  HistoryItem,
  HistoryDetail,
} from "../types/payments";
import { estimateBatch, executeBatchOnchain } from "./api";
import { validatePaymentRow } from "./validators";

type UsersState = {
  items: User[];
  create: (input: Pick<User, "name" | "wallet" | "defaultAmount">) => void;
  update: (id: string, input: Partial<User>) => void;
  remove: (id: string) => void;
};

export const useUsersStore = create<UsersState>()(
  persist(
    devtools((set, get) => ({
      items: [],
      create(input) {
        const now = new Date().toISOString();
        const user: User = {
          id: crypto.randomUUID(),
          name: input.name,
          wallet: input.wallet,
          defaultAmount: input.defaultAmount,
          createdAt: now,
          updatedAt: now,
        };
        set({ items: [user, ...get().items] });
      },
      update(id, input) {
        const now = new Date().toISOString();
        set({
          items: get().items.map((u) =>
            u.id === id ? { ...u, ...input, updatedAt: now } : u
          ),
        });
      },
      remove(id) {
        set({ items: get().items.filter((u) => u.id !== id) });
      },
    })),
    { name: "users-storage" }
  )
);

type PaymentsState = {
  rows: PaymentRow[];
  loading: boolean;
  error?: string;
  estimate?: BatchEstimate;
  setRows: (rows: PaymentRow[]) => void;
  addRow: (row: PaymentRow) => void;
  updateRow: (id: string, partial: Partial<PaymentRow>) => void;
  removeRow: (id: string) => void;
  clear: () => void;
  estimateBatch: () => void;
  executeBatch: () => Promise<{ batchId: string; txHash: string } | null>;
  executeSingle: (row: PaymentRow) => Promise<{ batchId: string; txHash: string } | null>;
};

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    devtools((set, get) => ({
      rows: [],
      loading: false,
      setRows(rows) {
        set({ rows });
      },
      addRow(row) {
        set({ rows: [row, ...get().rows] });
      },
      updateRow(id, partial) {
        set({
          rows: get().rows.map((r) => (r.id === id ? { ...r, ...partial } : r)),
        });
      },
      removeRow(id) {
        set({ rows: get().rows.filter((r) => r.id !== id) });
      },
      clear() {
        set({ rows: [], estimate: undefined });
      },
      estimateBatch() {
        const validRows = get().rows.filter((r) => validatePaymentRow(r).valid);
        const estimate = estimateBatch(validRows);
        set({ estimate });
      },
      async executeBatch() {
        set({ loading: true, error: undefined });
        try {
          const validRows = get().rows.filter((r) => validatePaymentRow(r).valid);
          const res = await executeBatchOnchain(validRows, get().estimate);
          const historyStore = useHistoryStore.getState();
          historyStore.addExecution({
            id: res.batchId,
            date: new Date().toISOString(),
            txHash: res.txHash,
            count: validRows.length,
            status: res.status,
            recipients: validRows.map((r) => ({
              name: r.name,
              wallet: r.wallet,
              amount: r.amount,
            })),
          });
          
          set({ rows: [], estimate: undefined });
          return { batchId: res.batchId, txHash: res.txHash };
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Falha ao executar batch";
          set({ error: message });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      async executeSingle(row) {
        set({ loading: true, error: undefined });
        try {
          const res = await executeBatchOnchain([row], undefined);
          const historyStore = useHistoryStore.getState();
          historyStore.addExecution({
            id: res.batchId,
            date: new Date().toISOString(),
            txHash: res.txHash,
            count: 1,
            status: res.status,
            recipients: [{ name: row.name, wallet: row.wallet, amount: row.amount }],
          });
          
          set({ rows: get().rows.filter((r) => r.id !== row.id) });
          return { batchId: res.batchId, txHash: res.txHash };
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Falha ao executar pagamento";
          set({ error: message });
          return null;
        } finally {
          set({ loading: false });
        }
      },
    })),
    { name: "payments-storage" }
  )
);

type HistoryState = {
  items: HistoryDetail[];
  addExecution: (item: HistoryDetail) => void;
  getDetail: (id: string) => HistoryDetail | undefined;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    devtools((set, get) => ({
      items: [],
      addExecution(item) {
        set({ items: [item, ...get().items] });
      },
      getDetail(id) {
        return get().items.find((i) => i.id === id);
      },
      clear() {
        set({ items: [] });
      },
    })),
    { name: "history-storage" }
  )
);
