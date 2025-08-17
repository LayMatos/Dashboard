# Documentação: Sistema Global de Normalização - Projeto Dash

## 📋 Resumo Executivo

Este documento descreve o **Sistema Global de Normalização** implementado para resolver problemas de incompatibilidade entre nomes de cidades no frontend e banco de dados, e fornecer utilitários reutilizáveis para todo o projeto.

## 🎯 Problema Original

### Cidades com Problemas de Normalização
- **Conquista Do Oeste** → No banco: "CONQUISTA D OESTE"
- **Mirassol Do Oeste** → No banco: "MIRASSOL D OESTE"
- **Glória Do Oeste** → No banco: "GLORIA D OESTE"
- **Lambari Do Oeste** → No banco: "LAMBARI D OESTE"
- **Figueirópolis Do Oeste** → No banco: "FIGUEIROPOLIS D OESTE"
- **Curvelândia** → No banco: "CUVERLANDIA"

### Necessidade de Escalabilidade
- Novas páginas precisarão usar nomes de cidades
- Evitar duplicação de código
- Manter consistência em todo o projeto

## 🛠️ Solução Implementada

### 1. Sistema Global de Utilitários

Criamos um sistema centralizado em `src/utils/stringUtils.ts` com funções reutilizáveis:

#### Estrutura de Arquivos
```
src/
├── utils/
│   ├── stringUtils.ts              # ✅ Sistema global de normalização
│   ├── index.ts                    # ✅ Arquivo de índice para importações
│   └── SGPM/
│       └── helpers.ts              # ✅ Re-exporta funções globais
```

### 2. Funções Disponíveis

#### Funções Básicas de Normalização
```typescript
// Remove apenas acentos
removeAcentos("Curvelândia") // "Curvelandia"

// Remove acentos + converte para minúsculas
normalizarString("São Paulo") // "sao paulo"

// Remove acentos + converte para maiúsculas
normalizarStringMaiuscula("Cáceres") // "CACERES"
```

#### Funções Específicas para Cidades
```typescript
// Normalização completa para cidades
normalizarNomeCidade("Conquista Do Oeste") // "CONQUISTA D OESTE"
normalizarNomeCidade("Curvelândia") // "CUVERLANDIA"

// Para envio à API
normalizarNomeCidadeParaAPI("Mirassol Do Oeste") // "MIRASSOL D OESTE"
```

#### Funções de Comparação
```typescript
// Compara dois nomes de cidades
compararNomesCidades("Cuiabá", "Cuiaba") // true

// Encontra cidade em uma lista
encontrarCidade("Cuiaba", ["Cuiabá", "Várzea Grande"]) // "Cuiabá"

// Verifica se cidade existe
cidadeExiste("Várzea Grande", listaCidades) // true
```

#### Funções de Validação
```typescript
// Valida nome de cidade
validarNomeCidade("Cuiabá") // true
validarNomeCidade("") // false
validarNomeCidade(null) // false
```

#### Funções de Utilidade
```typescript
// Normaliza lista de cidades
normalizarListaCidades(["Cuiabá", "Várzea Grande"])

// Remove duplicatas
removerDuplicatasCidades(["Cuiabá", "Cuiaba", "Várzea Grande"])

// Filtra por prefixo
filtrarCidadesPorPrefixo(listaCidades, "cui")
```

## 🔄 Como Usar

### 1. Importação Simples
```typescript
import { normalizarNomeCidade } from '../utils/stringUtils';
```

### 2. Importação Múltipla
```typescript
import { 
  normalizarNomeCidade, 
  compararNomesCidades, 
  encontrarCidade 
} from '../utils/stringUtils';
```

### 3. Importação via Índice
```typescript
import { normalizarNomeCidade } from '../utils';
```

### 4. Importação de Namespace
```typescript
import { StringUtils } from '../utils';

const cidadeNormalizada = StringUtils.normalizarNomeCidade("Conquista Do Oeste");
```

## 📁 Arquivos Atualizados

### Arquivos Modificados
1. **`src/utils/stringUtils.ts`** - ✅ Novo sistema global
2. **`src/utils/index.ts`** - ✅ Arquivo de índice
3. **`src/utils/SGPM/helpers.ts`** - ✅ Re-exporta funções globais
4. **`src/services/api.ts`** - ✅ Usa funções globais
5. **`src/services/SGPM/sgpmService.ts`** - ✅ Usa funções globais
6. **`src/pages/SGPM/SgpmDistribuicaoPage.tsx`** - ✅ Usa funções globais
7. **`src/components/MapaReal.tsx`** - ✅ Usa funções globais
8. **`src/hooks/useCONEQ.ts`** - ✅ Usa funções globais (CONEQ)

## ✅ Benefícios do Sistema Global

### 1. **Reutilização**
- ✅ Funções disponíveis em todo o projeto
- ✅ Não há duplicação de código
- ✅ Fácil manutenção

### 2. **Consistência**
- ✅ Padrão único de normalização
- ✅ Comportamento previsível
- ✅ Testes centralizados

### 3. **Escalabilidade**
- ✅ Fácil adicionar novas páginas
- ✅ Novas funções podem ser adicionadas
- ✅ Compatibilidade com futuras expansões

### 4. **Manutenibilidade**
- ✅ Mudanças em um local
- ✅ Documentação centralizada
- ✅ Fácil debugging

## 🚀 Exemplos de Uso

### Para Novas Páginas

```typescript
// Nova página que usa cidades
import { normalizarNomeCidade, compararNomesCidades } from '../utils/stringUtils';

const NovaPagina = () => {
  const processarCidade = (cidade: string) => {
    const normalizada = normalizarNomeCidade(cidade);
    // Lógica da página...
  };
  
  const buscarCidade = (cidadeBusca: string, listaCidades: string[]) => {
    return encontrarCidade(cidadeBusca, listaCidades);
  };
};
```

### Para APIs

```typescript
// Serviço de API
import { normalizarNomeCidadeParaAPI } from '../utils/stringUtils';

const buscarDadosPorCidade = async (cidade: string) => {
  const cidadeNormalizada = normalizarNomeCidadeParaAPI(cidade);
  const response = await api.get(`/dados?cidade=${cidadeNormalizada}`);
  return response.data;
};
```

### Para Componentes

```typescript
// Componente de busca
import { filtrarCidadesPorPrefixo } from '../utils/stringUtils';

const BuscaCidade = ({ cidades, termoBusca }) => {
  const cidadesFiltradas = filtrarCidadesPorPrefixo(cidades, termoBusca);
  return (
    <div>
      {cidadesFiltradas.map(cidade => (
        <div key={cidade}>{cidade}</div>
      ))}
    </div>
  );
};
```

### Para Módulo CONEQ

```typescript
// Hook useCONEQ com normalização global
import { normalizarNomeCidade, compararNomesCidades, encontrarCidade } from '../utils/stringUtils';

// Combinação de dados de cautelas e entregas
const combineCautelasAndEntregas = (cautelasData, entregasData, cidadesSelecionadas) => {
  // Criar dicionários com chaves normalizadas
  const cautelasDict = cautelasData.reduce((acc, item) => {
    const cidadeNormalizada = normalizarNomeCidade(item.nome_cidade);
    acc[cidadeNormalizada] = item.qtd_cautelas;
    return acc;
  }, {});

  const entregasDict = entregasData.reduce((acc, item) => {
    const cidadeNormalizada = normalizarNomeCidade(item.nome_cidade);
    acc[cidadeNormalizada] = item.qtd_entregas;
    return acc;
  }, {});

  // Combinar dados usando normalização
  return cidadesSelecionadas.map(cidade => {
    const cidadeNormalizada = normalizarNomeCidade(cidade);
    return {
      nome_cidade: cidade,
      Cautelas: cautelasDict[cidadeNormalizada] || 0,
      Entregas: entregasDict[cidadeNormalizada] || 0
    };
  });
};
```

## 🔧 Adicionando Novos Casos Especiais

### 1. Editar `src/utils/stringUtils.ts`
```typescript
const aplicarTratamentosEspeciais = (nomeNormalizado: string): string => {
  const casosEspeciais: Record<string, string> = {
    'CURVELANDIA': 'CUVERLANDIA',
    'NOVA_CIDADE': 'NOVA CIDADE', // Adicionar aqui
  };
  
  return casosEspeciais[nomeNormalizado] || nomeNormalizado;
};
```

### 2. Testar a Mudança
```typescript
import { normalizarNomeCidade } from '../utils/stringUtils';

console.log(normalizarNomeCidade("Nova Cidade")); // "NOVA CIDADE"
```

## 📊 Resultados dos Testes

### Teste das Funções Globais
```bash
=== TESTE DAS FUNÇÕES GLOBAIS DE NORMALIZAÇÃO ===

1. Teste das funções básicas:
removeAcentos("Curvelândia") -> "Curvelandia"
normalizarString("São Paulo") -> "sao paulo"
normalizarStringMaiuscula("Cáceres") -> "CACERES"

2. Teste das cidades problemáticas:
Conquista Do Oeste -> CONQUISTA D OESTE
Mirassol Do Oeste -> MIRASSOL D OESTE
Glória Do Oeste -> GLORIA D OESTE
Lambari Do Oeste -> LAMBARI D OESTE
Figueirópolis Do Oeste -> FIGUEIROPOLIS D OESTE
Curvelândia -> CUVERLANDIA

✅ TODOS OS TESTES PASSARAM
```

## 🎯 Próximos Passos

### 1. **Para Novas Páginas**
- Usar `import { normalizarNomeCidade } from '../utils/stringUtils'`
- Aproveitar as funções de comparação e busca
- Documentar novos casos de uso

### 2. **Para Manutenção**
- Adicionar novos casos especiais em `aplicarTratamentosEspeciais`
- Testar com `src/utils/test-global.js`
- Atualizar documentação se necessário

### 3. **Para Expansão**
- Adicionar novas funções em `stringUtils.ts`
- Exportar via `index.ts`
- Manter compatibilidade com código existente

## 📞 Suporte

### Documentação Relacionada
- `src/utils/stringUtils.ts` - Código fonte das funções
- `src/utils/NORMALIZACAO.md` - Documentação técnica detalhada
- `GUIA_TROUBLESHOOTING_NORMALIZACAO.md` - Guia de troubleshooting

### Para Dúvidas
1. **Consultar** a documentação técnica
2. **Testar** com as funções diretamente
3. **Verificar** exemplos de uso no código

---

**Data de Implementação**: Dezembro 2024  
**Versão**: 2.0 (Sistema Global)  
**Status**: ✅ Concluído e Testado  
**Compatibilidade**: ✅ Total com código existente
