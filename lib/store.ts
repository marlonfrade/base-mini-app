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

const MOCK_CSV_DATA: PaymentRow[] = [
  {
    id: crypto.randomUUID(),
    name: "Alice Silva",
    wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amount: "0.0001",
  },
  {
    id: crypto.randomUUID(),
    name: "Bruno Costa",
    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    amount: "0.0001",
  },
  {
    id: crypto.randomUUID(),
    name: "Carla Mendes",
    wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    amount: "0.0001",
  },
  {
    id: crypto.randomUUID(),
    name: "Daniel Oliveira",
    wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    amount: "0.0001",
  },
  {
    id: crypto.randomUUID(),
    name: "Elena Santos",
    wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    amount: "0.0001",
  },
];

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
  addMultipleRows: (rows: PaymentRow[]) => void;
  updateRow: (id: string, partial: Partial<PaymentRow>) => void;
  removeRow: (id: string) => void;
  clear: () => void;
  loadMockData: () => void;
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
        console.log("🔧 Store setRows chamado com:", rows.length, "pagamentos");
        set({ rows: [...rows] }, false, "setRows");
      },
      addRow(row) {
        const newRows = [row, ...get().rows];
        set({ rows: newRows }, false, "addRow");
      },
      addMultipleRows(newRows) {
        const current = get().rows;
        console.log("➕ Store addMultipleRows - Antes:", current.length, "Novos:", newRows.length);
        const combined = [...current, ...newRows];
        console.log("➕ Store addMultipleRows - Depois:", combined.length);
        set({ rows: combined }, false, "addMultipleRows");
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
      loadMockData() {
        const mockData = MOCK_CSV_DATA.map(row => ({
          ...row,
          id: crypto.randomUUID(),
        }));
        console.log("📝 Carregando dados mock:", mockData);
        set({ rows: mockData, estimate: undefined }, false, "loadMockData");
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
    { 
      name: "payments-storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          console.log("🔄 Migrando para versão 2 - limpando dados antigos");
          return {
            rows: [],
            loading: false,
            estimate: undefined,
          };
        }
        return persistedState;
      },
    }
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
    { 
      name: "history-storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          console.log("🔄 Migrando histórico para versão 2");
          return { items: [] };
        }
        return persistedState;
      },
    }
  )
);
