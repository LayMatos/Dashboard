// src/services/SGPMService.ts
import axios from "axios";
import {
  DadosSexo,
  DadosSituacao,
  DadosTipo,
  DadosEfetivo,
  DadosPorUnidade,
  PostoGraduacaoResponse,
} from "../../models/SGPM/types";

// Configuração da API
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000
};

/**
 * Remove acentos, caracteres especiais, deixa em maiúsculas e trim.
 */
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, " ") // Remove caracteres especiais
    .toUpperCase()
    .trim();
}

export const SGPMService = {
  /**
   * Busca dados de sexo por cidades.
   * @param cidades Lista de nomes das cidades (strings).
   * @returns Promise de array DadosSexo, com quantidade por sexo e cidade.
   */
  async getSexoPorCidade(cidades: string[]): Promise<DadosSexo[]> {
    try {
      if (!cidades || cidades.length === 0) {
        return [];
      }

      // Normalizar os nomes das cidades (remover acentos e converter para maiúsculas)
      const cidadesNormalizadas = cidades.map(cidade =>
        cidade
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .trim()
      );

      // Enviar como GET com as cidades como uma string única separada por vírgula
      const cidadesString = cidadesNormalizadas.join(', ');
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/contar_sexo_por_cidade`,
        { 
          params: { cidades: cidadesString },
          timeout: API_CONFIG.TIMEOUT
        }
      );

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Resposta inválida da API:', response.data);
        return [];
      }

      return response.data.map((item: any) => ({
        nome_cidade: item.nome_cidade,
        qtd_sexoM: item.qtd_sexoM || 0,
        qtd_sexoF: item.qtd_sexoF || 0,
        sexo: 'M',
        quantidade: item.qtd_sexoM || 0
      }));
    } catch (error: any) {
      console.error('Erro ao buscar dados de sexo por cidade:', error);
      return [];
    }
  },

  /**
   * Busca dados da situação dos policiais.
   */
  async getPolicialSituacao(): Promise<DadosSituacao[]> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/policiais_situacao`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar policiais_situacao:", error);
      throw error;
    }
  },

  /**
   * Busca dados do tipo dos policiais.
   */
  async getPolicialTipo(): Promise<DadosTipo[]> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/policiais_tipo`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar policiais_tipo:", error);
      throw error;
    }
  },

  /**
   * Busca dados do sexo dos policiais.
   */
  async getPolicialSexo(): Promise<DadosSexo[]> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/policiais_sexo`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar policiais_sexo:", error);
      throw error;
    }
  },

  /**
   * Busca dados de posto/graduação.
   */
  async getDadosPostoGrad(): Promise<PostoGraduacaoResponse> {
    try {
      const response = await axios.get<PostoGraduacaoResponse>(
        `${API_CONFIG.BASE_URL}/dados_posto_grad`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados_posto_grad:", error);
      return { 
        feminino: [], 
        masculino: []
      };
    }
  },

  /**
   * Busca totais por CR.
   */
  async getTotaisPorCR(): Promise<DadosEfetivo> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/totais-por-cr`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar totais-por-cr:", error);
      throw error;
    }
  },

  /**
   * Busca dados de sexo por unidade em uma cidade.
   */
  async getSexoPorUnidade(cidade: string): Promise<DadosPorUnidade[]> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/contar_sexo_por_unidade`, {
        params: { cidade }, // sem normalização aqui
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar sexo por unidade:", error);
      throw error;
    }
  },
};
