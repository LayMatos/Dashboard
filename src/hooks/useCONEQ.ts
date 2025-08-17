import { useState, useEffect } from 'react';
import { 
  EstoqueData, 
  TipoEquipamento, 
  DadosCombinados, 
  EstoqueResponse, 
  CautelaResponse,
  EntregaData,
  CautelaData
} from '../types/coneq';
import { normalizarNomeCidade, compararNomesCidades, encontrarCidade } from '../utils/stringUtils';

// Configuração da API
const API_CONFIG = {
  BASE_URL: 'http://172.16.10.54:8000/api'
};

export const useCONEQ = (gruposDeMunicipios: Record<string, string[]>) => {
  const [equipamentos, setEquipamentos] = useState<EstoqueData[]>([]);
  const [cautelas, setCautelas] = useState<EstoqueData[]>([]);
  const [tiposEquipamentos, setTiposEquipamentos] = useState<TipoEquipamento[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [cidadeDataEquipamentos, setCidadeDataEquipamentos] = useState<DadosCombinados[]>([]);
  const [activeButton, setActiveButton] = useState<string>("estoque");
  const [selectedCR, setSelectedCR] = useState<string[]>([]);

  // Interface para a resposta da API
  interface EstoqueResponseData {
    estoque: Array<{
      status: string;
      quantidade: number;
    }>;
    cautelas: number;
  }

  // Função genérica para buscar dados
  const fetchData = async <T,>(endpoint: string, setter: (data: T) => void, transformData?: (data: any) => T, cidades?: string[]) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const queryParams = cidades ? new URLSearchParams({ cidades: JSON.stringify(cidades) }).toString() : '';
      const fullUrl = `${url}${queryParams ? `?${queryParams}` : ''}`;

      console.log(`Fazendo requisição para: ${fullUrl}`);
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Endpoint não encontrado: ${fullUrl}`);
          setter(transformData ? transformData({} as any) : {} as T);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        console.warn(`Nenhum dado recebido da URL: ${fullUrl}`);
        setter(transformData ? transformData({} as any) : {} as T);
        return;
      }

      console.log('Dados recebidos:', data);
      setter(transformData ? transformData(data) : data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setter(transformData ? transformData({} as any) : {} as T);
    }
  };

  // Função para transformar dados do estoque
  const transformEstoqueData = (data: EstoqueResponseData): EstoqueData[] => {
    if (!data || !data.estoque) {
      console.warn('Dados de estoque não encontrados');
      return [];
    }

    const statusMap: Record<string, string> = {
      'EM ESTOQUE': 'Em Estoque',
      'ENTREGUE': 'Entregue',
      'SEPARADO PARA ENTREGA': 'Separado para Entrega'
    };

    return data.estoque.map(item => ({
      name: statusMap[item.status] || item.status,
      value: item.quantidade || 0
    }));
  };

  // Função para transformar dados das cautelas
  const transformCautelasData = (data: CautelaResponse): EstoqueData[] => {
    if (!data || !data.cautela) {
      console.warn('Dados de cautela não encontrados');
      return [];
    }

    const statusMap: Record<number, string> = {
      7: 'Assinado',
      6: 'Aguardando Assinatura',
      9: 'Descautelado',
      8: 'Parcialmente Descautelado'
    };

    return data.cautela.map(item => ({
      name: statusMap[Number(item.status)] || `Status ${item.status}`,
      value: item.quantidade || 0
    }));
  };

  // Função para combinar dados de cautelas e entregas
  const combineCautelasAndEntregas = (
    cautelasData: CautelaData[], 
    entregasData: EntregaData[], 
    cidadesSelecionadas: string[]
  ): DadosCombinados[] => {
    console.log('Dados recebidos - Cautelas:', cautelasData);
    console.log('Dados recebidos - Entregas:', entregasData);
    console.log('Cidades selecionadas:', cidadesSelecionadas);

    // Create dictionaries with normalized keys using global normalization
    const cautelasDict = cautelasData.reduce((acc: Record<string, number>, item) => {
      const cidadeNormalizada = normalizarNomeCidade(item.nome_cidade);
      acc[cidadeNormalizada] = item.qtd_cautelas;
      return acc;
    }, {});

    const entregasDict = entregasData.reduce((acc: Record<string, number>, item) => {
      const cidadeNormalizada = normalizarNomeCidade(item.nome_cidade);
      acc[cidadeNormalizada] = item.qtd_entregas;
      return acc;
    }, {});

    console.log('Dicionário de cautelas:', cautelasDict);
    console.log('Dicionário de entregas:', entregasDict);

    const dadosCombinados = cidadesSelecionadas.map(cidade => {
      const cidadeNormalizada = normalizarNomeCidade(cidade);
      const dadoCidade = {
        nome_cidade: cidade,
        Cautelas: cautelasDict[cidadeNormalizada] || 0,
        Entregas: entregasDict[cidadeNormalizada] || 0
      };
      console.log(`Dados combinados para ${cidade} (${cidadeNormalizada}):`, dadoCidade);
      return dadoCidade;
    });

    console.log('Dados combinados final:', dadosCombinados);
    return dadosCombinados;
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoId = event.target.value;
    setSelectedTipo(tipoId);

    if (tipoId === "") {
      // Buscar todos os equipamentos agrupados por status
      fetchData('/estoque_geral', setEquipamentos, transformEstoqueData);
      fetchData('/cautela_geral', setCautelas, transformCautelasData);
    } else {
      fetchData(`/estoqueDado/${tipoId}`, setEquipamentos, transformEstoqueData);
      fetchData(`/status_counts/${tipoId}`, setCautelas, transformCautelasData);
    }
  };

  const handleGroupClick = async (crSelecionado: string[]) => {
    try {
      const cidadesSelecionadas = Array.isArray(crSelecionado) ? crSelecionado : [];
      const crCorrespondente = Object.keys(gruposDeMunicipios).find(cr => {
        return cidadesSelecionadas.every(cidade => 
          gruposDeMunicipios[cr]?.includes(cidade)
        );
      });

      if (!crCorrespondente) {
        console.log("CR correspondente não encontrado.");
        return;
      }

      const cidadesDoCR = gruposDeMunicipios[crCorrespondente] || [];
      
      if (cidadesDoCR.length === 0) {
        console.log("Nenhuma cidade encontrada para o CR selecionado.");
        return;
      }

      // Usar normalização global para as cidades
      const cidadesNormalizadas = cidadesDoCR.map(cidade => normalizarNomeCidade(cidade));
      setSelectedCR(cidadesNormalizadas);

      const cidadesQuery = cidadesNormalizadas.join(',');

      const [cautelasResponse, entregasResponse] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/quantitativoPorCidade?cidades=${cidadesQuery}`),
        fetch(`${API_CONFIG.BASE_URL}/contar_entregas_por_cidade?cidades=${cidadesQuery}`)
      ]);

      if (!cautelasResponse.ok || !entregasResponse.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const [cautelasData, entregasData] = await Promise.all([
        cautelasResponse.json(),
        entregasResponse.json()
      ]);

      const combinedData = combineCautelasAndEntregas(cautelasData, entregasData, cidadesNormalizadas);
      setCidadeDataEquipamentos(combinedData);
    } catch (error) {
      console.error('Erro ao buscar dados das cidades:', error);
      setCidadeDataEquipamentos([]);
    }
  };

  useEffect(() => {
    fetchData('/TipoEquipamentos', setTiposEquipamentos);
  }, []);

  useEffect(() => {
    if (tiposEquipamentos.length > 0) {
      // Iniciar com "Todos os tipos"
      setSelectedTipo("");
      fetchData('/estoque_geral', setEquipamentos, transformEstoqueData);
      fetchData('/cautela_geral', setCautelas, transformCautelasData);
    }
  }, [tiposEquipamentos]);

  useEffect(() => {
    if (selectedTipo && selectedTipo !== "") {
      fetchData(`/estoqueDado/${selectedTipo}`, setEquipamentos, transformEstoqueData);
      fetchData(`/status_counts/${selectedTipo}`, setCautelas, transformCautelasData);
    }
  }, [selectedTipo]);

  return {
    equipamentos,
    cautelas,
    tiposEquipamentos,
    selectedTipo,
    cidadeDataEquipamentos,
    activeButton,
    selectedCR,
    setActiveButton,
    handleSelectChange,
    handleGroupClick
  };
}; 