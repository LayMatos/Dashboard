import { useState, useEffect } from 'react';
import { SGPMService } from '../../services/SGPM/sgpmService';
import { 
  fetchSexoPorCidade as fetchSexoPorCidadeAPI, 
  fetchTotaisPorCR 
} from '../../services/api';

export const useSGPMData = () => {
  // Estados para os dados dos filtros
  const [comandosRegionais, setComandosRegionais] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [unidadesSubordinadas, setUnidadesSubordinadas] = useState<any[]>([]);
  const [postosGraduacao, setPostosGraduacao] = useState<any[]>([]);

  // Estados para os filtros selecionados
  const [selectedSexo, setSelectedSexo] = useState<string>('');
  const [selectedSituacao, setSelectedSituacao] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedComandoRegional, setSelectedComandoRegional] = useState<number | null>(null);
  const [selectedUnidade, setSelectedUnidade] = useState<number | null>(null);
  const [selectedPostoGrad, setSelectedPostoGrad] = useState<number | null>(null);

  // Estados para os dados filtrados
  const [dadosFiltrados, setDadosFiltrados] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUnidades, setLoadingUnidades] = useState<boolean>(false);

  // Estados adicionais para a página de distribuição
  const [sexos, setSexos] = useState<any[]>([]);
  const [dadosEfetivo, setDadosEfetivo] = useState<any>({});
  const [dadosPorUnidade, setDadosPorUnidade] = useState<any[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar dados dos filtros em paralelo
        const [comandosRes, unidadesRes, postosRes, sexosRes, efetivoRes] = await Promise.all([
          SGPMService.getComandosRegionais(),
          SGPMService.getUnidades(),
          SGPMService.getPostosGraduacao(),
          SGPMService.getPoliciaisPorSexo(),
          fetchTotaisPorCR()
        ]);

        setComandosRegionais(comandosRes || []);
        setUnidades(unidadesRes || []);
        setPostosGraduacao(postosRes || []);
        setSexos(sexosRes || []);
        setDadosEfetivo(efetivoRes || {});

      } catch (error) {
        console.error('Erro ao carregar dados dos filtros:', error);
        // Em caso de erro, definir arrays vazios para evitar problemas
        setComandosRegionais([]);
        setUnidades([]);
        setPostosGraduacao([]);
        setSexos([]);
        setDadosEfetivo({});
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Carregar unidades subordinadas quando um comando regional for selecionado
  useEffect(() => {
    const carregarUnidadesSubordinadas = async () => {
      if (selectedComandoRegional) {
        try {
          setLoadingUnidades(true);
          const unidadesRes = await SGPMService.getUnidadesPorComando(selectedComandoRegional);
          setUnidadesSubordinadas(unidadesRes || []);
        } catch (error) {
          console.error('Erro ao carregar unidades subordinadas:', error);
          setUnidadesSubordinadas([]);
        } finally {
          setLoadingUnidades(false);
        }
      } else {
        // Se nenhum comando regional estiver selecionado, limpar as unidades subordinadas
        setUnidadesSubordinadas([]);
        setLoadingUnidades(false);
      }
    };

    carregarUnidadesSubordinadas();
  }, [selectedComandoRegional]);

  // Limpar unidade selecionada quando o comando regional mudar
  useEffect(() => {
    setSelectedUnidade(null);
  }, [selectedComandoRegional]);

  // Aplicar filtros quando qualquer filtro for alterado
  useEffect(() => {
    const aplicarFiltros = async () => {
      try {
        setLoading(true);
        
        const response = await SGPMService.filtrarPoliciaisAvancado(
          selectedSexo || undefined,
          selectedSituacao || undefined,
          selectedTipo || undefined,
          selectedComandoRegional || undefined,
          selectedUnidade || undefined,
          selectedPostoGrad || undefined
        );

        setDadosFiltrados(response);
      } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        setDadosFiltrados({ quantidade: 0, dados: [] });
      } finally {
        setLoading(false);
      }
    };

    // Só aplicar filtros se pelo menos um filtro estiver selecionado
    if (selectedSexo || selectedSituacao || selectedTipo || 
        selectedComandoRegional || selectedUnidade || selectedPostoGrad) {
      aplicarFiltros();
    } else {
      setDadosFiltrados(null);
    }
  }, [selectedSexo, selectedSituacao, selectedTipo, 
      selectedComandoRegional, selectedUnidade, selectedPostoGrad]);

  // Funções para a página de distribuição
  const fetchSexoPorCidade = async (cidades: string[]): Promise<any[]> => {
    try {
      const data: any[] = await fetchSexoPorCidadeAPI(cidades);
      setSexos(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados por cidade:', error);
      return [];
    }
  };

  const fetchSexoPorUnidade = async (cidade: string): Promise<any[]> => {
    try {
      const response = await SGPMService.getPoliciaisPorUnidade(cidade);
      const data: any[] = response.data || [];
      setDadosPorUnidade(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados por unidade:', error);
      return [];
    }
  };

  // Função para resetar todos os filtros
  const handleReset = () => {
    setSelectedSexo('');
    setSelectedSituacao('');
    setSelectedTipo('');
    setSelectedComandoRegional(null);
    setSelectedUnidade(null);
    setSelectedPostoGrad(null);
    setDadosFiltrados(null);
  };

  return {
    // Dados dos filtros
    comandosRegionais,
    unidades,
    unidadesSubordinadas,
    postosGraduacao,
    
    // Estados dos filtros
    selectedSexo,
    setSelectedSexo,
    selectedSituacao,
    setSelectedSituacao,
    selectedTipo,
    setSelectedTipo,
    selectedComandoRegional,
    setSelectedComandoRegional,
    selectedUnidade,
    setSelectedUnidade,
    selectedPostoGrad,
    setSelectedPostoGrad,
    
    // Dados filtrados
    dadosFiltrados,
    loading,
    loadingUnidades,
    
    // Dados para a página de distribuição
    sexos,
    setSexos,
    dadosEfetivo,
    dadosPorUnidade,
    fetchSexoPorCidade,
    fetchSexoPorUnidade,
    
    // Funções
    handleReset
  };
};
