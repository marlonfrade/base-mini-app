import type { User } from "../types/user";
import type {
  PaymentRow,
  BatchEstimate,
  BatchExecuteResult,
  HistoryItem,
  HistoryDetail,
} from "../types/payments";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: ctrl.signal,
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data?.message ?? data?.error ?? message;
      } catch {}
      throw new Error(message);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

export const api = {
  users: {
    list: () => fetchJson<User[]>("/users/list"),
    create: (input: Pick<User, "name" | "wallet" | "defaultAmount">) =>
      fetchJson<User>("/users/create", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (input: Partial<User> & { id: string }) =>
      fetchJson<User>("/users/update", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    delete: (id: string) =>
      fetchJson<{ ok: true }>("/users/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
  },
  batch: {
    estimate: (rows: PaymentRow[]) =>
      fetchJson<BatchEstimate>("/batch/estimate", {
        method: "POST",
        body: JSON.stringify({ rows }),
      }),
    execute: (rows: PaymentRow[], estimate?: BatchEstimate) =>
      fetchJson<BatchExecuteResult>("/batch/execute", {
        method: "POST",
        body: JSON.stringify({ rows, estimate }),
      }),
  },
  history: {
    list: () => fetchJson<HistoryItem[]>("/history/list"),
    detail: (id: string) => fetchJson<HistoryDetail>(`/history/${id}`),
  },
};





