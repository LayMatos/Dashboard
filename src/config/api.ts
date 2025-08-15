// Configuração centralizada da API
export const API_CONFIG = {
  // URL base da API - altere aqui para mudar o servidor
  BASE_URL: 'http://localhost:8000/api',
  
  // Timeout das requisições (em milissegundos)
  TIMEOUT: 30000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Função para obter a URL completa de um endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Função para obter a URL base
export const getBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
}; 