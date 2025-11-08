import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Toaster } from "../components/ui/sonner";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Join the ${minikitConfig.miniapp.name} Waitlist`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="en">
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <SafeArea>
            <div className="grid min-h-dvh md:grid-cols-[240px_1fr]">
              <div className="hidden border-r md:block">
                <Sidebar />
              </div>
              <div className="grid grid-rows-[auto_1fr]">
                <Header />
                <main className="p-4">{children}</main>
              </div>
            </div>
            <Toaster richColors position="bottom-center" />
          </SafeArea>
        </body>
      </html>
    </RootProvider>
  );
}
