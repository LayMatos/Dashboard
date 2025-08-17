import { useState, useEffect } from 'react';
import { BarChartData, DoughnutChartData, EstoqueItem, EstoqueStatusData } from '../types/coneq';

export const useEstoque = () => {
  const [activeButton, setActiveButton] = useState("estoque");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [barData, setBarData] = useState<BarChartData>({
    labels: [],
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: [],
        backgroundColor: "#1D4ED8",
        borderRadius: 5,
      },
    ],
  });

  const [doughnutData, setDoughnutData] = useState<DoughnutChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  });

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch("http://172.16.10.54:8000/api/estoque");
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados do estoque: ${response.statusText}`);
      }

      const data = await response.json() as EstoqueItem[];
      if (Array.isArray(data)) {
        const labels = data.map(item => item.equipamento_nome);
        const quantidadeEstoque = data.map(item => item.quantidade_em_estoque);

        setBarData({
          labels,
          datasets: [
            {
              label: "Quantidade em Estoque",
              data: quantidadeEstoque,
              backgroundColor: "#1D4ED8",
              borderRadius: 5,
            },
          ],
        });
      } else {
        throw new Error("Formato de dados inválido");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao buscar dados da API");
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const fetchDoughnutData = async () => {
    try {
      setError(null);
      const response = await fetch("http://172.16.10.54:8000/api/estoque_geral");
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados do status: ${response.statusText}`);
      }

      const data = await response.json() as EstoqueStatusData;
      if (data.estoque && Array.isArray(data.estoque)) {
        const labels = data.estoque.map(item => item.status);
        const quantidadeStatus = data.estoque.map(item => item.quantidade);
        quantidadeStatus.push(data.cautelas);

        setDoughnutData({
          labels: [...labels, "CAUTELADOS"],
          datasets: [
            {
              data: quantidadeStatus,
              backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3"],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        });
      } else {
        throw new Error("Formato de dados inválido");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao buscar dados do status");
      console.error("Erro ao buscar dados do gráfico de Doughnut:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([fetchData(), fetchDoughnutData()]);
  };

  useEffect(() => {
    refreshData();

    const intervalId = setInterval(refreshData, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(intervalId);
  }, []);

  return {
    activeButton,
    setActiveButton,
    barData,
    doughnutData,
    isLoading,
    error,
    refreshData
  };
}; 