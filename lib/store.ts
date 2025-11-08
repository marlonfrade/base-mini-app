import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../types/user";
import type {
  PaymentRow,
  BatchEstimate,
  HistoryItem,
  HistoryDetail,
} from "../types/payments";
import { api } from "./api";
import { validatePaymentRow } from "./validators";

// Users Store
type UsersState = {
  items: User[];
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  create: (
    input: Pick<User, "name" | "wallet" | "defaultAmount">
  ) => Promise<void>;
  update: (id: string, input: Partial<User>) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useUsersStore = create<UsersState>()(
  devtools((set, get) => ({
    items: [],
    loading: false,
    async load() {
      set({ loading: true, error: undefined });
      try {
        const items = await api.users.list();
        set({ items });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Erro ao carregar usuários";
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },
    async create(input) {
      const optimistic: User = {
        id: `tmp-${crypto.randomUUID()}`,
        ...input,
      } as User;
      set({ items: [optimistic, ...get().items] });
      try {
        const created = await api.users.create(input);
        set({
          items: get().items.map((u) => (u.id === optimistic.id ? created : u)),
        });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Falha ao criar usuário";
        set({
          items: get().items.filter((u) => u.id !== optimistic.id),
          error: message,
        });
      }
    },
    async update(id, input) {
      try {
        const updated = await api.users.update({ id, ...input });
        set({ items: get().items.map((u) => (u.id === id ? updated : u)) });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Falha ao atualizar usuário";
        set({ error: message });
      }
    },
    async remove(id) {
      const prev = get().items;
      set({ items: prev.filter((u) => u.id !== id) });
      try {
        await api.users.delete(id);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Falha ao remover usuário";
        set({ items: prev, error: message });
      }
    },
  }))
);

// Payments Store
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
  estimateBatch: () => Promise<void>;
  executeBatch: () => Promise<{ batchId: string } | null>;
  executeSingle: (row: PaymentRow) => Promise<{ batchId: string } | null>;
};

export const usePaymentsStore = create<PaymentsState>()(
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
    async estimateBatch() {
      set({ loading: true, error: undefined });
      try {
        const validRows = get().rows.filter((r) => validatePaymentRow(r).valid);
        const estimate = await api.batch.estimate(validRows);
        set({ estimate });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Falha ao estimar batch";
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },
    async executeBatch() {
      set({ loading: true, error: undefined });
      try {
        const validRows = get().rows.filter((r) => validatePaymentRow(r).valid);
        const res = await api.batch.execute(validRows, get().estimate);
        set({ rows: [], estimate: undefined });
        return { batchId: res.batchId };
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
        // Execute only the provided row immediately
        const res = await api.batch.execute([row], undefined);
        // Remove the executed row from scheduled list
        set({ rows: get().rows.filter((r) => r.id !== row.id) });
        return { batchId: res.batchId };
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Falha ao executar pagamento";
        set({ error: message });
        return null;
      } finally {
        set({ loading: false });
      }
    },
  }))
);

// History Store
type HistoryState = {
  items: HistoryItem[];
  detail?: HistoryDetail;
  loading: boolean;
  error?: string;
  load: () => Promise<void>;
  loadDetail: (id: string) => Promise<void>;
  prepend: (item: HistoryItem) => void;
};

export const useHistoryStore = create<HistoryState>()(
  devtools((set) => ({
    items: [],
    loading: false,
    async load() {
      set({ loading: true, error: undefined });
      try {
        const items = await api.history.list();
        set({ items });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Erro ao carregar histórico";
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },
    async loadDetail(id) {
      set({ loading: true, error: undefined });
      try {
        const detail = await api.history.detail(id);
        set({ detail });
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Erro ao carregar detalhe";
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },
    prepend(item) {
      set((s) => ({ items: [item, ...s.items] }));
    },
  }))
);
