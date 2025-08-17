/**
 * Arquivo de índice para utilitários globais
 * Facilita as importações em todo o projeto
 */

// ============================================================================
// UTILITÁRIOS DE STRING E NORMALIZAÇÃO
// ============================================================================

export {
  // Funções básicas de normalização
  removeAcentos,
  normalizarString,
  normalizarStringMaiuscula,
  
  // Funções específicas para cidades
  normalizarNomeCidade,
  normalizarNomeCidadeParaAPI,
  compararNomesCidades,
  encontrarCidade,
  validarNomeCidade,
  cidadeExiste,
  
  // Funções de utilidade para cidades
  normalizarListaCidades,
  removerDuplicatasCidades,
  filtrarCidadesPorPrefixo,
  
  // Aliases para compatibilidade
  normalizarCidade,
  normalizarCidadeParaAPI
} from './stringUtils';

// ============================================================================
// UTILITÁRIOS ESPECÍFICOS DE MÓDULOS
// ============================================================================

// SGPM
export {
  calcularTotaisPorCR,
  findQuantidadeByTipo,
  somaInativos,
  getQuantidadePorSexo,
  findQuantidadeBySituacao,
  sexoMapeado
} from './SGPM/helpers';

// ============================================================================
// RE-EXPORTAÇÕES PARA FACILITAR IMPORTAÇÕES
// ============================================================================

// Importar tudo de uma vez
export * as StringUtils from './stringUtils';
export * as SGPMUtils from './SGPM/helpers';
