import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AutoLoadMockData from "../components/AutoLoadMockData";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "next-themes";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Junte-se à lista de espera ${minikitConfig.miniapp.name}`,
          action: {
            name: `Abrir ${minikitConfig.miniapp.name}`,
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
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AutoLoadMockData />
            <SafeArea>
              <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
                  <aside className="hidden border-r border-border/40 bg-card/50 backdrop-blur-xl lg:block">
                    <Sidebar />
                  </aside>
                  <div className="flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-auto">
                      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
                        {children}
                      </div>
                    </main>
                  </div>
                </div>
              </div>
              <Toaster richColors position="bottom-right" />
            </SafeArea>
          </ThemeProvider>
        </body>
      </html>
    </RootProvider>
  );
}
