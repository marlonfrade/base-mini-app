import { http, createConfig } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Base Payment System",
      preference: "all",
    }),
    metaMask({
      dappMetadata: {
        name: "Base Payment System",
      },
    }),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata: {
              name: "Base Payment System",
              description: "Sistema de pagamentos em lote na Base",
              url: "https://base-mini-app.vercel.app",
              icons: ["https://avatars.githubusercontent.com/u/37784886"],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [arbitrumSepolia.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL || 
      "https://sepolia-rollup.arbitrum.io/rpc",
      {
        timeout: 10_000,
        retryCount: 3,
        retryDelay: 1000,
      }
    ),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
