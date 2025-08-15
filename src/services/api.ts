import axios from 'axios';
import { 
  DadosSituacao, 
  DadosTipo, 
  DadosSexo, 
  DadosFiltrados,
  DadosEfetivo,
  DadosPorUnidade 
} from '../types/sgpm';

// Configuração da API
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
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
  tipo?: string
): Promise<DadosFiltrados | null> => {
  try {
    const params = new URLSearchParams();
    if (sexo) params.append("sexo", sexo);
    if (situacao) params.append("situacao", situacao);
    if (tipo) params.append("tipo", tipo);

    const response = await api.get(`/policiais_filtro?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados filtrados:", error);
    return null;
  }
};

export const fetchSexoPorCidade = async (cidades: string[]): Promise<DadosPorUnidade[]> => {
  try {
    // Enviar as cidades como uma string única separada por vírgula
    const cidadesString = cidades.join(', ');
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