/**
 * Utilitários para normalização de strings
 * Funções globais para uso em todo o projeto
 */

// ============================================================================
// FUNÇÕES BÁSICAS DE NORMALIZAÇÃO
// ============================================================================

/**
 * Remove acentos de uma string
 * @param texto - String com acentos
 * @returns String sem acentos
 */
export const removeAcentos = (texto: string): string => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Normaliza string para minúsculas (remove acentos, converte para minúsculas)
 * @param texto - String a ser normalizada
 * @returns String normalizada em minúsculas
 */
export const normalizarString = (texto: string): string => {
  return removeAcentos(texto).toLowerCase().trim();
};

/**
 * Normaliza string para maiúsculas (remove acentos, converte para maiúsculas)
 * @param texto - String a ser normalizada
 * @returns String normalizada em maiúsculas
 */
export const normalizarStringMaiuscula = (texto: string): string => {
  return removeAcentos(texto).toUpperCase().trim();
};

// ============================================================================
// FUNÇÕES ESPECÍFICAS PARA CIDADES
// ============================================================================

/**
 * Normaliza nome de cidade para corresponder ao formato do banco de dados
 * Remove acentos, caracteres especiais, converte para maiúsculas
 * e aplica regras específicas para cidades
 * 
 * @param nomeCidade - Nome da cidade a ser normalizado
 * @returns Nome da cidade normalizado
 */
export const normalizarNomeCidade = (nomeCidade: string): string => {
  let normalizada = nomeCidade
    // Remove acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove caracteres especiais exceto espaços
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    // Converte para maiúsculas
    .toUpperCase()
    // Remove espaços extras
    .trim()
    // Substitui "DO" por "D" para corresponder ao banco
    .replace(/\bDO\b/g, 'D')
    // Remove espaços duplicados
    .replace(/\s+/g, ' ');
  
  // Tratamentos específicos para casos especiais
  normalizada = aplicarTratamentosEspeciais(normalizada);
  
  return normalizada;
};

/**
 * Normaliza nome de cidade para envio à API
 * Alias para normalizarNomeCidade para manter compatibilidade
 * 
 * @param nomeCidade - Nome da cidade a ser normalizado
 * @returns Nome da cidade normalizado para API
 */
export const normalizarNomeCidadeParaAPI = (nomeCidade: string): string => {
  return normalizarNomeCidade(nomeCidade);
};

/**
 * Aplica tratamentos específicos para casos especiais de cidades
 * @param nomeNormalizado - Nome já normalizado
 * @returns Nome com tratamentos especiais aplicados
 */
const aplicarTratamentosEspeciais = (nomeNormalizado: string): string => {
  // Mapeamento de casos especiais
  const casosEspeciais: Record<string, string> = {
    'CURVELANDIA': 'CUVERLANDIA',
    // Adicione novos casos especiais aqui
    // 'NOME_ORIGINAL': 'NOME_CORRIGIDO',
  };
  
  return casosEspeciais[nomeNormalizado] || nomeNormalizado;
};

// ============================================================================
// FUNÇÕES DE COMPARAÇÃO
// ============================================================================

/**
 * Compara dois nomes de cidades normalizando ambos
 * @param nome1 - Primeiro nome de cidade
 * @param nome2 - Segundo nome de cidade
 * @returns true se os nomes normalizados forem iguais
 */
export const compararNomesCidades = (nome1: string, nome2: string): boolean => {
  const normalizado1 = normalizarNomeCidade(nome1);
  const normalizado2 = normalizarNomeCidade(nome2);
  return normalizado1 === normalizado2;
};

/**
 * Encontra uma cidade em uma lista usando normalização
 * @param cidadeBusca - Cidade a ser buscada
 * @param listaCidades - Lista de cidades para buscar
 * @returns A cidade encontrada ou null
 */
export const encontrarCidade = (cidadeBusca: string, listaCidades: string[]): string | null => {
  const cidadeNormalizada = normalizarNomeCidade(cidadeBusca);
  
  for (const cidade of listaCidades) {
    if (normalizarNomeCidade(cidade) === cidadeNormalizada) {
      return cidade;
    }
  }
  
  return null;
};

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================================

/**
 * Verifica se um nome de cidade é válido
 * @param nomeCidade - Nome da cidade a ser validado
 * @returns true se o nome for válido
 */
export const validarNomeCidade = (nomeCidade: string): boolean => {
  if (!nomeCidade || typeof nomeCidade !== 'string') {
    return false;
  }
  
  const nomeLimpo = nomeCidade.trim();
  return nomeLimpo.length > 0 && nomeLimpo.length <= 100;
};

/**
 * Verifica se uma cidade existe em uma lista
 * @param cidade - Cidade a ser verificada
 * @param listaCidades - Lista de cidades
 * @returns true se a cidade existir na lista
 */
export const cidadeExiste = (cidade: string, listaCidades: string[]): boolean => {
  return encontrarCidade(cidade, listaCidades) !== null;
};

// ============================================================================
// FUNÇÕES DE UTILIDADE
// ============================================================================

/**
 * Normaliza uma lista de cidades
 * @param cidades - Lista de cidades a serem normalizadas
 * @returns Lista de cidades normalizadas
 */
export const normalizarListaCidades = (cidades: string[]): string[] => {
  return cidades.map(cidade => normalizarNomeCidade(cidade));
};

/**
 * Remove duplicatas de uma lista de cidades usando normalização
 * @param cidades - Lista de cidades
 * @returns Lista sem duplicatas
 */
export const removerDuplicatasCidades = (cidades: string[]): string[] => {
  const cidadesUnicas = new Set<string>();
  const resultado: string[] = [];
  
  for (const cidade of cidades) {
    const normalizada = normalizarNomeCidade(cidade);
    if (!cidadesUnicas.has(normalizada)) {
      cidadesUnicas.add(normalizada);
      resultado.push(cidade);
    }
  }
  
  return resultado;
};

/**
 * Filtra cidades que começam com um prefixo (case-insensitive)
 * @param cidades - Lista de cidades
 * @param prefixo - Prefixo para filtrar
 * @returns Lista filtrada
 */
export const filtrarCidadesPorPrefixo = (cidades: string[], prefixo: string): string[] => {
  const prefixoNormalizado = normalizarString(prefixo);
  
  return cidades.filter(cidade => {
    const cidadeNormalizada = normalizarString(cidade);
    return cidadeNormalizada.startsWith(prefixoNormalizado);
  });
};

// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================

// Re-exportar funções antigas para manter compatibilidade
export {
  normalizarNomeCidade as normalizarCidade,
  normalizarNomeCidadeParaAPI as normalizarCidadeParaAPI,
};
