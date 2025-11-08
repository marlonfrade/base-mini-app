import type { User } from "../types/user";
import type { PaymentRow, HistoryDetail } from "../types/payments";
import { useUsersStore, usePaymentsStore, useHistoryStore } from "./store";

export const MOCK_USERS: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Alice Silva",
    wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    defaultAmount: "0.0001",
  },
  {
    name: "Bruno Costa",
    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    defaultAmount: "0.0001",
  },
  {
    name: "Carla Mendes",
    wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    defaultAmount: "0.0001",
  },
  {
    name: "Daniel Oliveira",
    wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    defaultAmount: "0.0001",
  },
  {
    name: "Elena Santos",
    wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    defaultAmount: "0.0001",
  },
  {
    name: "Fernando Lima",
    wallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    defaultAmount: "0.0001",
  },
  {
    name: "Gabriela Rocha",
    wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    defaultAmount: "0.0001",
  },
  {
    name: "Henrique Alves",
    wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    defaultAmount: "0.0001",
  },
  {
    name: "Isabela Martins",
    wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    defaultAmount: "0.0001",
  },
  {
    name: "João Pereira",
    wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    defaultAmount: "0.0001",
  },
  {
    name: "Karen Barbosa",
    wallet: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    defaultAmount: "0.0001",
  },
  {
    name: "Lucas Souza",
    wallet: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    defaultAmount: "0.0001",
  },
  {
    name: "Marina Fernandes",
    wallet: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    defaultAmount: "0.0001",
  },
  {
    name: "Nicolas Cardoso",
    wallet: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    defaultAmount: "0.0001",
  },
  {
    name: "Olivia Teixeira",
    wallet: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
  },
];

export const MOCK_PAYMENT_ROWS: Omit<PaymentRow, "id">[] = [
  {
    name: "Alice Silva",
    wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amount: "0.0001",
    meta: { description: "Pagamento de teste 1" },
  },
  {
    name: "Bruno Costa",
    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    amount: "0.0001",
    meta: { description: "Pagamento de teste 2" },
  },
  {
    name: "Carla Mendes",
    wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    amount: "0.0001",
    meta: { description: "Pagamento de teste 3" },
  },
  {
    name: "Daniel Oliveira",
    wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    amount: "0.0001",
    meta: { description: "Pagamento de teste 4" },
  },
  {
    name: "Elena Santos",
    wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    amount: "0.0001",
    meta: { description: "Pagamento de teste 5" },
  },
];

export const MOCK_HISTORY: Omit<HistoryDetail, "id">[] = [
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    count: 8,
    status: "confirmed",
    gasCostWei: "234567",
    recipients: [
      { name: "Alice Silva", wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "0.0001", status: "success" },
      { name: "Bruno Costa", wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "0.0001", status: "success" },
      { name: "Carla Mendes", wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: "0.0001", status: "success" },
      { name: "Daniel Oliveira", wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "0.0001", status: "success" },
      { name: "Elena Santos", wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", amount: "0.0001", status: "success" },
      { name: "Fernando Lima", wallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", amount: "0.0001", status: "success" },
      { name: "Gabriela Rocha", wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", amount: "0.0001", status: "success" },
      { name: "Henrique Alves", wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", amount: "0.0001", status: "success" },
    ],
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    txHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    count: 5,
    status: "confirmed",
    gasCostWei: "189432",
    recipients: [
      { name: "Isabela Martins", wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", amount: "0.0001", status: "success" },
      { name: "João Pereira", wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096", amount: "0.0001", status: "success" },
      { name: "Karen Barbosa", wallet: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", amount: "0.0001", status: "success" },
      { name: "Lucas Souza", wallet: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a", amount: "0.0001", status: "success" },
      { name: "Marina Fernandes", wallet: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", amount: "0.0001", status: "success" },
    ],
  },
  {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    txHash: "0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d",
    count: 3,
    status: "failed",
    gasCostWei: "98765",
    recipients: [
      { name: "Nicolas Cardoso", wallet: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097", amount: "0.0001", status: "failed" },
      { name: "Olivia Teixeira", wallet: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71", amount: "0.0001", status: "failed" },
      { name: "Pedro Gonçalves", wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", amount: "0.0001", status: "failed" },
    ],
  },
  {
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
    txHash: "0x2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a",
    count: 6,
    status: "confirmed",
    gasCostWei: "212456",
    recipients: [
      { name: "Alice Silva", wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "0.0001", status: "success" },
      { name: "Bruno Costa", wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "0.0001", status: "success" },
      { name: "Elena Santos", wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", amount: "0.0001", status: "success" },
      { name: "Rafaela Dias", wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", amount: "0.0001", status: "success" },
      { name: "Sérgio Moraes", wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", amount: "0.0001", status: "success" },
      { name: "Tatiana Ribeiro", wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096", amount: "0.0001", status: "success" },
    ],
  },
];

export function loadMockData() {
  const usersStore = useUsersStore.getState();
  const paymentsStore = usePaymentsStore.getState();
  const historyStore = useHistoryStore.getState();

  if (usersStore.items.length === 0) {
    console.log("📦 Loading mock users...");
    MOCK_USERS.forEach((user) => {
      usersStore.create(user);
    });
  }

  if (paymentsStore.rows.length === 0) {
    console.log("📦 Loading mock payment rows...");
    MOCK_PAYMENT_ROWS.forEach((row) => {
      paymentsStore.addRow({
        id: crypto.randomUUID(),
        ...row,
      });
    });
  }

  if (historyStore.items.length === 0) {
    console.log("📦 Loading mock history...");
    MOCK_HISTORY.forEach((item) => {
      historyStore.addExecution({
        id: crypto.randomUUID(),
        ...item,
      });
    });
  }

  console.log("✅ Mock data loaded successfully!");
}

export function clearMockData() {
  const usersStore = useUsersStore.getState();
  const paymentsStore = usePaymentsStore.getState();
  const historyStore = useHistoryStore.getState();

  usersStore.items = [];
  paymentsStore.clear();
  historyStore.clear();

  console.log("🗑️ All mock data cleared!");
}
