import axios from 'axios';
import { 
  DadosSituacao, 
  DadosTipo, 
  DadosSexo, 
  DadosFiltrados,
  DadosEfetivo,
  DadosPorUnidade,
  ComandoRegional,     
  Unidade,            
  PostoGraduacaoInfo
} from '../types/sgpm';
import { normalizarNomeCidadeParaAPI } from '../utils/stringUtils';

// Configuração da API
const API_CONFIG = {
  BASE_URL: 'http://172.16.10.54:8000/api',
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

export const fetchComandosRegionais = async (): Promise<ComandoRegional[]> => {
  try {
    const response = await api.get('/comandos_regionais');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comandos regionais:', error);
    return [];
  }
};

export const fetchUnidades = async (): Promise<Unidade[]> => {
  try {
    // Buscar unidades conforme a query SQL fornecida
    const response = await api.get('/unidades_sgpm');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    return [];
  }
};

export const fetchPostosGraduacao = async (): Promise<PostoGraduacaoInfo[]> => {
  try {
    // Buscar postos/graduação conforme a query SQL fornecida
    const response = await api.get('/postos_graduacao_sgpm');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postos de graduação:', error);
    return [];
  }
};

// Funções que estavam faltando
export const fetchPoliciaisPorSexo = async (): Promise<DadosSexo[]> => {
  try {
    const response = await api.get('/policiais_sexo');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar policiais por sexo:', error);
    return [];
  }
};

export const fetchPoliciaisPorSituacao = async (): Promise<DadosSituacao[]> => {
  try {
    const response = await api.get('/policiais_situacao');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar policiais por situação:', error);
    return [];
  }
};

export const fetchPoliciaisPorTipo = async (): Promise<DadosTipo[]> => {
  try {
    const response = await api.get('/policiais_tipo');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar policiais por tipo:', error);
    return [];
  }
};

export const fetchPoliciaisPorPostoGradSexo = async (
  sexo?: string,
  situacao?: string,
  tipo?: string
): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (sexo) params.append("sexo", sexo);
    if (situacao) params.append("situacao", situacao);
    if (tipo) params.append("tipo", tipo);

    const response = await api.get(`/dados_posto_grad?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar policiais por posto/graduação e sexo:', error);
    return { feminino: [], masculino: [] };
  }
};

export const fetchPoliciaisFiltradosAvancado = async (
  sexo?: string,
  situacao?: string,
  tipo?: string,
  comandoId?: number,
  unidadeId?: number,
  postoGradId?: number
): Promise<DadosFiltrados | null> => {
  try {
    const params = new URLSearchParams();
    if (sexo) params.append("sexo", sexo);
    if (situacao) params.append("situacao", situacao);
    if (tipo) params.append("tipo", tipo);
    if (comandoId) params.append("comando_regional", comandoId.toString());
    if (unidadeId) params.append("unidade", unidadeId.toString());
    if (postoGradId) params.append("posto_grad", postoGradId.toString());

    const response = await api.get(`/policiais_filtro_avancado?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados filtrados avançados:", error);
    return null;
  }
};

export const fetchPoliciaisPorCidade = async (cidades: string[]): Promise<DadosPorUnidade[]> => {
  try {
    const cidadesString = cidades.join(', ');
    const response = await api.get(`/contar_sexo_por_cidade?cidades=${encodeURIComponent(cidadesString)}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar policiais por cidade:', error);
    return [];
  }
};

export const fetchUnidadesPorComando = async (comandoId?: number): Promise<Unidade[]> => {
  try {
    const params = comandoId ? `?comando_id=${comandoId}` : '';
    const response = await api.get(`/unidades_por_comando${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar unidades por comando:', error);
    return [];
  }
};

export const fetchPostosGraduacoes = async (): Promise<PostoGraduacaoInfo[]> => {
  try {
    const response = await api.get('/postos_graduacao_sgpm');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postos de graduação:', error);
    return [];
  }
};

export const fetchPoliciais = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return [];
  }
};

export const fetchPoliciaisFiltrados = async (
  sexo?: string,
  situacao?: string,
  tipo?: string,
  comando?: string,
  unidade?: string,
  posto?: string
): Promise<DadosFiltrados | null> => {
  try {
    const params = new URLSearchParams();
    if (sexo) params.append("sexo", sexo);
    if (situacao) params.append("situacao", situacao);
    if (tipo) params.append("tipo", tipo);
    if (comando) params.append("comando", comando);
    if (unidade) params.append("unidade", unidade);
    if (posto) params.append("posto", posto);

    const response = await api.get(`/policiais_filtro?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados filtrados:", error);
    return null;
  }
};

export const fetchSexoPorCidade = async (cidades: string[]): Promise<DadosPorUnidade[]> => {
  try {
    // Normalizar os nomes das cidades antes de enviar para a API
    const cidadesNormalizadas = cidades.map(cidade => normalizarNomeCidadeParaAPI(cidade));
    
    // Enviar as cidades normalizadas como uma string única separada por vírgula
    const cidadesString = cidadesNormalizadas.join(', ');
    const response = await api.get(`/contar_sexo_por_cidade?cidades=${encodeURIComponent(cidadesString)}`);
    return response.data;
    
  } catch (error) {
    console.error('Erro ao buscar dados de sexos por cidade:', error);
    return [];
  }
};

export const fetchTotaisPorCR = async (): Promise<DadosEfetivo> => {
  try {
    const response = await api.get('/totais-por-cr');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar totais por CR:', error);
    return {};
  }
}; 