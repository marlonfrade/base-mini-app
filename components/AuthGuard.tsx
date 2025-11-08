"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, address, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      router.push("/login");
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
