"use client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Database, Trash2 } from "lucide-react";
import { loadMockData, clearMockData } from "@/lib/mockData";
import { toast } from "sonner";
import { useState } from "react";

export default function MockDataControls() {
  const [loading, setLoading] = useState(false);

  const handleLoadData = () => {
    setLoading(true);
    try {
      loadMockData();
      toast.success("Dados mock carregados com sucesso!", {
        description: "15 usuários, 5 pagamentos e 5 execuções adicionados",
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Erro ao carregar dados mock");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
      setLoading(true);
      try {
        clearMockData();
        toast.success("Todos os dados foram removidos!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error("Erro ao limpar dados");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dados de Demonstração
        </CardTitle>
        <CardDescription>
          Carregue dados mock para testar a aplicação ou limpe tudo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          onClick={handleLoadData}
          disabled={loading}
          variant="default"
          className="gap-2"
        >
          <Database className="h-4 w-4" />
          Carregar Dados Mock
        </Button>
        <Button
          onClick={handleClearData}
          disabled={loading}
          variant="destructive"
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Limpar Tudo
        </Button>
      </CardContent>
    </Card>
  );
}
