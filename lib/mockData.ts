import type { User } from "../types/user";
import type { PaymentRow, HistoryDetail } from "../types/payments";
import { useUsersStore, usePaymentsStore, useHistoryStore } from "./store";

export const MOCK_USERS: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Alice Silva",
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    defaultAmount: "100",
  },
  {
    name: "Bruno Costa",
    wallet: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    defaultAmount: "250",
  },
  {
    name: "Carla Mendes",
    wallet: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    defaultAmount: "150",
  },
  {
    name: "Daniel Oliveira",
    wallet: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    defaultAmount: "200",
  },
  {
    name: "Elena Santos",
    wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    defaultAmount: "300",
  },
  {
    name: "Fernando Lima",
    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    defaultAmount: "175",
  },
  {
    name: "Gabriela Rocha",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    defaultAmount: "225",
  },
  {
    name: "Henrique Alves",
    wallet: "0x9F7A046A59E347A7A59b6eE0F0e70c33A2e5d5e9",
    defaultAmount: "125",
  },
  {
    name: "Isabela Martins",
    wallet: "0x0E3A09decdA46D96D3bc06e1e3e7A3F3d3e5a8e9",
    defaultAmount: "180",
  },
  {
    name: "João Pereira",
    wallet: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
    defaultAmount: "220",
  },
  {
    name: "Karen Barbosa",
    wallet: "0x6F46CF5569AefA1aCc8f4C8C8f8f8f8f8f8f8f8f",
    defaultAmount: "190",
  },
  {
    name: "Lucas Souza",
    wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    defaultAmount: "160",
  },
  {
    name: "Marina Fernandes",
    wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    defaultAmount: "240",
  },
  {
    name: "Nicolas Cardoso",
    wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    defaultAmount: "210",
  },
  {
    name: "Olivia Teixeira",
    wallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  },
];

export const MOCK_PAYMENT_ROWS: Omit<PaymentRow, "id">[] = [
  {
    name: "Pedro Gonçalves",
    wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    amount: "500",
    meta: { description: "Pagamento de freelance - Design UI/UX" },
  },
  {
    name: "Rafaela Dias",
    wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    amount: "750",
    meta: { description: "Desenvolvimento frontend - Sprint 3" },
  },
  {
    name: "Sérgio Moraes",
    wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    amount: "300",
    meta: { description: "Consultoria técnica" },
  },
  {
    name: "Tatiana Ribeiro",
    wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    amount: "450",
    meta: { description: "Copywriting - Conteúdo do site" },
  },
  {
    name: "Vinicius Araujo",
    wallet: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    amount: "600",
    meta: { description: "Desenvolvimento backend - API REST" },
  },
];

export const MOCK_HISTORY: Omit<HistoryDetail, "id">[] = [
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
    count: 8,
    status: "confirmed",
    gasCostWei: "234567",
    recipients: [
      { name: "Alice Silva", wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", amount: "100", status: "success" },
      { name: "Bruno Costa", wallet: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", amount: "250", status: "success" },
      { name: "Carla Mendes", wallet: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", amount: "150", status: "success" },
      { name: "Daniel Oliveira", wallet: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", amount: "200", status: "success" },
      { name: "Elena Santos", wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", amount: "300", status: "success" },
      { name: "Fernando Lima", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826", amount: "175", status: "success" },
      { name: "Gabriela Rocha", wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", amount: "225", status: "success" },
      { name: "Henrique Alves", wallet: "0x9F7A046A59E347A7A59b6eE0F0e70c33A2e5d5e9", amount: "125", status: "success" },
    ],
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    txHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    count: 5,
    status: "confirmed",
    gasCostWei: "189432",
    recipients: [
      { name: "Isabela Martins", wallet: "0x0E3A09decdA46D96D3bc06e1e3e7A3F3d3e5a8e9", amount: "180", status: "success" },
      { name: "João Pereira", wallet: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", amount: "220", status: "success" },
      { name: "Karen Barbosa", wallet: "0x6F46CF5569AefA1aCc8f4C8C8f8f8f8f8f8f8f8f", amount: "190", status: "success" },
      { name: "Lucas Souza", wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: "160", status: "success" },
      { name: "Marina Fernandes", wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "240", status: "success" },
    ],
  },
  {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    txHash: "0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d",
    count: 3,
    status: "failed",
    gasCostWei: "98765",
    recipients: [
      { name: "Nicolas Cardoso", wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", amount: "210", status: "failed" },
      { name: "Olivia Teixeira", wallet: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", amount: "130", status: "failed" },
      { name: "Pedro Gonçalves", wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", amount: "500", status: "failed" },
    ],
  },
  {
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
    txHash: "0x2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a",
    count: 6,
    status: "confirmed",
    gasCostWei: "212456",
    recipients: [
      { name: "Alice Silva", wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", amount: "100", status: "success" },
      { name: "Bruno Costa", wallet: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", amount: "250", status: "success" },
      { name: "Elena Santos", wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", amount: "300", status: "success" },
      { name: "Rafaela Dias", wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", amount: "750", status: "success" },
      { name: "Sérgio Moraes", wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", amount: "300", status: "success" },
      { name: "Tatiana Ribeiro", wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096", amount: "450", status: "success" },
    ],
  },
  {
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    count: 2,
    status: "pending",
    recipients: [
      { name: "Vinicius Araujo", wallet: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", amount: "600" },
      { name: "Marina Fernandes", wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "240" },
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
