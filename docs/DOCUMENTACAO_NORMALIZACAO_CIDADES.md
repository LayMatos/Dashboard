# Documentação: Solução de Normalização de Nomes de Cidades - Projeto SGPM

## 📋 Resumo Executivo

Este documento descreve a solução implementada para resolver o problema de incompatibilidade entre os nomes de cidades no frontend e no banco de dados do projeto SGPM (Sistema de Gestão de Policiais Militares).

## 🎯 Problema Identificado

### Cidades com Problemas de Normalização

O projeto apresentava inconsistências na comunicação entre o frontend e o banco de dados para as seguintes cidades:

1. **Conquista Do Oeste** → No banco: "CONQUISTA D OESTE"
2. **Mirassol Do Oeste** → No banco: "MIRASSOL D OESTE"
3. **Glória Do Oeste** → No banco: "GLORIA D OESTE"
4. **Lambari Do Oeste** → No banco: "LAMBARI D OESTE"
5. **Figueirópolis Do Oeste** → No banco: "FIGUEIROPOLIS D OESTE"
6. **Curvelândia** → No banco: "CUVERLANDIA"

### Causa Raiz

- **Apostrofos**: Cidades com "Do" no nome tinham apóstrofos removidos no banco
- **Acentos**: Cidade "Curvelândia" tinha o acento (^) removido no banco
- **Inconsistência**: Frontend enviava nomes originais, banco esperava nomes normalizados

## 🛠️ Solução Implementada

### 1. Centralização das Funções de Normalização

Criamos um sistema centralizado de normalização em `src/utils/SGPM/helpers.ts` com as seguintes funções:

#### Funções Principais

```typescript
// Função genérica para remover acentos
export const removeAcentos = (texto: string): string => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Função para normalização específica de cidades
export const normalizarNomeCidade = (nomeCidade: string): string => {
  let normalizada = nomeCidade
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toUpperCase()
    .trim()
    .replace(/\bDO\b/g, 'D')
    .replace(/\s+/g, ' ');
  
  // Tratamento específico para Curvelândia
  if (normalizada === 'CURVELANDIA') {
    normalizada = 'CUVERLANDIA';
  }
  
  return normalizada;
};
```

### 2. Atualização dos Serviços de API

#### Arquivo: `src/services/api.ts`
```typescript
export const fetchSexoPorCidade = async (cidades: string[]): Promise<DadosPorUnidade[]> => {
  try {
    // Normalizar os nomes das cidades antes de enviar para a API
    const cidadesNormalizadas = cidades.map(cidade => normalizarNomeCidadeParaAPI(cidade));
    
    const cidadesString = cidadesNormalizadas.join(', ');
    const response = await api.get(`/contar_sexo_por_cidade?cidades=${encodeURIComponent(cidadesString)}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de sexos por cidade:', error);
    return [];
  }
};
```

#### Arquivo: `src/services/SGPM/sgpmService.ts`
```typescript
getPoliciaisPorUnidade: (cidade: string) => {
  const cidadeNormalizada = normalizarNomeCidadeParaAPI(cidade);
  return api.get('/contar_sexo_por_unidade', { params: { cidade: cidadeNormalizada } });
},
```

### 3. Atualização da Página de Distribuição

#### Arquivo: `src/pages/SGPM/SgpmDistribuicaoPage.tsx`
```typescript
const dadosCompletos: DadosSexo[] = cidadesMaiusculas.map(cidade => {
  const cidadeNormalizada = normalizarNomeCidade(cidade);
  
  const dadoExistente = dadosSexo.find(dado => {
    if (!dado.nome_cidade) return false;
    
    const dadoCidadeNormalizada = normalizarNomeCidade(dado.nome_cidade);
    
    return dadoCidadeNormalizada === cidadeNormalizada;
  });
  
  // ... resto da lógica
});
```

## 📁 Estrutura de Arquivos Modificados

```
src/
├── utils/
│   └── SGPM/
│       ├── helpers.ts                    # ✅ Funções centralizadas
│       └── NORMALIZACAO.md              # ✅ Documentação técnica
├── services/
│   ├── api.ts                           # ✅ Atualizado
│   └── SGPM/
│       └── sgpmService.ts               # ✅ Atualizado
├── pages/
│   └── SGPM/
│       └── SgpmDistribuicaoPage.tsx     # ✅ Atualizado
├── components/
│   └── MapaReal.tsx                     # ✅ Atualizado
└── hooks/
    └── useCONEQ.ts                      # ✅ Atualizado
```

## 🔧 Funções de Normalização Disponíveis

### 1. `removeAcentos(texto: string)`
- **Propósito**: Remove apenas acentos
- **Exemplo**: "Curvelândia" → "Curvelandia"

### 2. `normalizarString(texto: string)`
- **Propósito**: Remove acentos + converte para minúsculas
- **Exemplo**: "Curvelândia" → "curvelandia"

### 3. `normalizarStringMaiuscula(texto: string)`
- **Propósito**: Remove acentos + converte para maiúsculas
- **Exemplo**: "Curvelândia" → "CURVELANDIA"

### 4. `normalizarNomeCidade(nomeCidade: string)`
- **Propósito**: Normalização específica para cidades
- **Características**:
  - Remove acentos e caracteres especiais
  - Converte para maiúsculas
  - Substitui "DO" por "D"
  - Tratamento específico para "Curvelândia" → "CUVERLANDIA"

### 5. `normalizarNomeCidadeParaAPI(nomeCidade: string)`
- **Propósito**: Para envio à API
- **Características**: Mesmas da função `normalizarNomeCidade`

## ✅ Resultados dos Testes

### Cidades Problemáticas - Antes vs Depois

| Cidade Original | Antes (Erro) | Depois (Correto) |
|-----------------|--------------|------------------|
| Conquista Do Oeste | CONQUISTA DO OESTE | **CONQUISTA D OESTE** |
| Mirassol Do Oeste | MIRASSOL DO OESTE | **MIRASSOL D OESTE** |
| Glória Do Oeste | GLÓRIA DO OESTE | **GLORIA D OESTE** |
| Lambari Do Oeste | LAMBARI DO OESTE | **LAMBARI D OESTE** |
| Figueirópolis Do Oeste | FIGUEIRÓPOLIS DO OESTE | **FIGUEIROPOLIS D OESTE** |
| Curvelândia | CURVELÂNDIA | **CUVERLANDIA** |

### Teste de Funcionamento
```bash
=== TESTE FINAL DAS FUNÇÕES DE NORMALIZAÇÃO ===

1. Teste das cidades problemáticas:
Conquista Do Oeste -> CONQUISTA D OESTE
Mirassol Do Oeste -> MIRASSOL D OESTE
Glória Do Oeste -> GLORIA D OESTE
Lambari Do Oeste -> LAMBARI D OESTE
Figueirópolis Do Oeste -> FIGUEIROPOLIS D OESTE
Curvelândia -> CUVERLANDIA

✅ TODOS OS TESTES PASSARAM
```

## 🎯 Benefícios Alcançados

### 1. **Resolução do Problema Original**
- ✅ Todas as 6 cidades problemáticas agora funcionam corretamente
- ✅ Dados são exibidos corretamente no gráfico de distribuição geográfica
- ✅ Comunicação consistente entre frontend e banco de dados

### 2. **Melhorias na Arquitetura**
- ✅ **Centralização**: Todas as funções de normalização em um local
- ✅ **Consistência**: Padrão único para normalização em todo o projeto
- ✅ **Manutenibilidade**: Mudanças centralizadas
- ✅ **Reutilização**: Eliminação de código duplicado
- ✅ **Testabilidade**: Funções isoladas e testáveis

### 3. **Documentação**
- ✅ Documentação técnica completa
- ✅ Exemplos de uso para cada função
- ✅ Guia para desenvolvedores

## 🔄 Como Usar

### Para Novos Desenvolvedores

1. **Importar a função necessária**:
```typescript
import { normalizarNomeCidade } from '../utils/SGPM/helpers';
```

2. **Usar a função**:
```typescript
const cidadeNormalizada = normalizarNomeCidade("Conquista Do Oeste");
// Resultado: "CONQUISTA D OESTE"
```

### Para Adicionar Novas Cidades

1. **Cidades com "Do"**: Automático - a função já trata
2. **Cidades com acentos**: Automático - a função já trata
3. **Casos especiais**: Adicionar na função `normalizarNomeCidade`

## 🚀 Próximos Passos Recomendados

### 1. **Monitoramento**
- Acompanhar se novas cidades com problemas similares aparecem
- Verificar logs de erro relacionados a nomes de cidades

### 2. **Melhorias Futuras**
- Considerar migração do banco de dados para usar nomes normalizados
- Implementar cache para normalizações frequentes
- Adicionar testes automatizados para as funções de normalização

### 3. **Documentação**
- Atualizar documentação da API
- Criar guia de troubleshooting para problemas similares

## 📞 Suporte

Para dúvidas ou problemas relacionados à normalização de nomes de cidades:

1. **Consultar**: `src/utils/SGPM/NORMALIZACAO.md`
2. **Verificar**: Logs de erro no console do navegador
3. **Testar**: Usar as funções de normalização diretamente

---

**Data de Implementação**: Dezembro 2024  
**Versão**: 1.0  
**Status**: ✅ Concluído e Testado
