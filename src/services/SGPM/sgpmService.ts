import axios from 'axios';
import { 
  fetchPoliciaisPorSexo,
  fetchPoliciaisPorSituacao,
  fetchPoliciaisPorTipo,
  fetchPoliciaisPorPostoGradSexo,
  fetchPoliciaisFiltradosAvancado,
  fetchPoliciaisPorCidade,
  fetchTotaisPorCR,
  fetchComandosRegionais,
  fetchUnidades,
  fetchUnidadesPorComando,
  fetchPostosGraduacao
} from '../api';
import { normalizarNomeCidadeParaAPI } from '../../utils/stringUtils';

const API_CONFIG = {
  BASE_URL: 'http://172.16.10.54:8000/api',
  TIMEOUT: 30000
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
});

export const SGPMService = {
  getPoliciaisPorSexo: () => fetchPoliciaisPorSexo(),
  getPoliciaisPorTipo: () => fetchPoliciaisPorTipo(),
  getPoliciaisPorSituacao: () => fetchPoliciaisPorSituacao(),
  getPoliciaisPorPostoGradSexo: (sexo?: string, situacao?: string, tipo?: string) => 
    fetchPoliciaisPorPostoGradSexo(sexo, situacao, tipo),
  filtrarPoliciais: (sexo?: string, situacao?: string, tipo?: string) => 
    fetchPoliciaisFiltradosAvancado(sexo, situacao, tipo),
  getTotaisPorCR: () => fetchTotaisPorCR(),
  getPoliciaisPorCidade: (cidades: string[]) => 
    fetchPoliciaisPorCidade(cidades),
  getPoliciaisPorUnidade: (cidade: string) => {
    // Normalizar o nome da cidade antes de enviar para a API
    const cidadeNormalizada = normalizarNomeCidadeParaAPI(cidade);
    
    return api.get('/contar_sexo_por_unidade', { params: { cidade: cidadeNormalizada } });
  },

  getPostosGraduacao: () => fetchPostosGraduacao(),
  getUnidades: () => fetchUnidades(),
  getUnidadesPorComando: (comandoId: number) => fetchUnidadesPorComando(comandoId),
  getComandosRegionais: () => fetchComandosRegionais(),
  filtrarPoliciaisAvancado: (
    sexo?: string,
    situacao?: string,
    tipo?: string,
    comandoRegional?: number,
    unidade?: number,
    postoGrad?: number
  ) => fetchPoliciaisFiltradosAvancado(
    sexo,
    situacao,
    tipo,
    comandoRegional,
    unidade,
    postoGrad
  )
};
