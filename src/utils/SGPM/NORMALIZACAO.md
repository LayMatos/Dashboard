# Funções de Normalização de Strings

Este documento descreve as funções de normalização de strings centralizadas no projeto.

## Localização
Todas as funções estão localizadas em: `src/utils/SGPM/helpers.ts`

## Funções Disponíveis

### 1. `removeAcentos(texto: string): string`
**Propósito**: Remove apenas os acentos de uma string
**Exemplo**:
```typescript
removeAcentos("Curvelândia") // "Curvelandia"
removeAcentos("São Paulo") // "Sao Paulo"
```

### 2. `normalizarString(texto: string): string`
**Propósito**: Remove acentos, converte para minúsculas e remove espaços extras
**Exemplo**:
```typescript
normalizarString("Curvelândia") // "curvelandia"
normalizarString("São Paulo") // "sao paulo"
```

### 3. `normalizarStringMaiuscula(texto: string): string`
**Propósito**: Remove acentos, converte para maiúsculas e remove espaços extras
**Exemplo**:
```typescript
normalizarStringMaiuscula("Curvelândia") // "CURVELANDIA"
normalizarStringMaiuscula("São Paulo") // "SAO PAULO"
```

### 4. `normalizarNomeCidade(nomeCidade: string): string`
**Propósito**: Normaliza nomes de cidades para corresponder ao formato do banco de dados
**Características**:
- Remove acentos
- Remove caracteres especiais
- Converte para maiúsculas
- Substitui "DO" por "D"
- Tratamento específico para "Curvelândia" → "CUVERLANDIA"

**Exemplo**:
```typescript
normalizarNomeCidade("Conquista Do Oeste") // "CONQUISTA D OESTE"
normalizarNomeCidade("Curvelândia") // "CUVERLANDIA"
normalizarNomeCidade("Mirassol Do Oeste") // "MIRASSOL D OESTE"
```

### 5. `normalizarNomeCidadeParaAPI(nomeCidade: string): string`
**Propósito**: Normaliza nomes de cidades para envio à API
**Características**: Mesmas da função `normalizarNomeCidade`

## Uso no Projeto

### Mapa (MapaReal.tsx)
```typescript
import { normalizarString } from '../utils/SGPM/helpers';
const normalizeName = normalizarString;
```

### CONEQ (useCONEQ.ts)
```typescript
import { removeAcentos } from '../utils/SGPM/helpers';
// Usa a função centralizada em vez de definir localmente
```

### SGPM (SgpmDistribuicaoPage.tsx)
```typescript
import { normalizarNomeCidade } from '../../utils/SGPM/helpers';
// Usa para comparação de dados
```

### API (api.ts e sgpmService.ts)
```typescript
import { normalizarNomeCidadeParaAPI } from '../utils/SGPM/helpers';
// Usa para normalizar antes de enviar para a API
```

## Benefícios da Centralização

1. **Consistência**: Todas as normalizações seguem o mesmo padrão
2. **Manutenibilidade**: Mudanças precisam ser feitas em apenas um lugar
3. **Reutilização**: Evita duplicação de código
4. **Testabilidade**: Funções isoladas são mais fáceis de testar

## Casos Especiais

### Cidades com "Do"
- "Conquista Do Oeste" → "CONQUISTA D OESTE"
- "Mirassol Do Oeste" → "MIRASSOL D OESTE"
- "Glória Do Oeste" → "GLORIA D OESTE"

### Cidades com Acentos
- "Curvelândia" → "CUVERLANDIA" (tratamento específico)
- "São Paulo" → "SAO PAULO"
- "Cáceres" → "CACERES"
