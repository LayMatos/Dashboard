# Guia de Troubleshooting - Normalização de Nomes de Cidades

## 🚨 Problemas Comuns e Soluções

### 1. **Cidade não aparece no gráfico de distribuição**

#### Sintomas:
- Cidade selecionada no mapa não mostra dados
- Gráfico vazio ou com dados zerados
- Console mostra erro de cidade não encontrada

#### Diagnóstico:
```javascript
// No console do navegador, teste a normalização:
import { normalizarNomeCidade } from '../utils/SGPM/helpers';

// Teste a cidade problemática
console.log(normalizarNomeCidade("Nome da Cidade"));
```

#### Soluções:
1. **Verificar se a cidade está no banco de dados**
2. **Comparar o nome normalizado com o banco**
3. **Adicionar tratamento específico se necessário**

### 2. **Dados retornam vazios para cidades conhecidas**

#### Sintomas:
- API retorna array vazio
- Cidade existe no banco mas não retorna dados
- Erro 404 ou 500 na requisição

#### Diagnóstico:
```javascript
// Verificar a requisição sendo enviada
console.log('Cidades sendo enviadas:', cidadesNormalizadas);
console.log('URL da requisição:', fullUrl);
```

#### Soluções:
1. **Verificar se a normalização está correta**
2. **Confirmar se a API está funcionando**
3. **Verificar logs do backend**

### 3. **Cidade com nome especial não funciona**

#### Sintomas:
- Cidade com caracteres especiais não normaliza corretamente
- Comparação falha mesmo com normalização

#### Diagnóstico:
```javascript
// Teste todas as funções de normalização
const cidade = "Nome Especial da Cidade";

console.log('Original:', cidade);
console.log('removeAcentos:', removeAcentos(cidade));
console.log('normalizarString:', normalizarString(cidade));
console.log('normalizarNomeCidade:', normalizarNomeCidade(cidade));
```

#### Soluções:
1. **Adicionar tratamento específico na função `normalizarNomeCidade`**
2. **Verificar se há caracteres não previstos**
3. **Atualizar a documentação com o novo caso**

## 🔧 Comandos de Diagnóstico

### 1. **Teste Rápido de Normalização**
```javascript
// Cole no console do navegador
const testarNormalizacao = (cidade) => {
  console.log('=== TESTE DE NORMALIZAÇÃO ===');
  console.log('Cidade original:', cidade);
  console.log('Normalizada:', normalizarNomeCidade(cidade));
  console.log('Para API:', normalizarNomeCidadeParaAPI(cidade));
};

// Teste suas cidades
testarNormalizacao("Conquista Do Oeste");
testarNormalizacao("Curvelândia");
```

### 2. **Verificar Dados da API**
```javascript
// Função para debugar requisições
const debugAPI = async (cidades) => {
  console.log('Cidades originais:', cidades);
  
  const cidadesNormalizadas = cidades.map(cidade => normalizarNomeCidadeParaAPI(cidade));
  console.log('Cidades normalizadas:', cidadesNormalizadas);
  
  const cidadesString = cidadesNormalizadas.join(', ');
  console.log('String para API:', cidadesString);
  
  // Fazer a requisição
  const response = await fetch(`/api/contar_sexo_por_cidade?cidades=${encodeURIComponent(cidadesString)}`);
  const data = await response.json();
  
  console.log('Resposta da API:', data);
  return data;
};
```

### 3. **Comparar com Banco de Dados**
```javascript
// Função para comparar nomes
const compararNomes = (nomeFrontend, nomeBanco) => {
  const frontendNormalizado = normalizarNomeCidade(nomeFrontend);
  const bancoNormalizado = normalizarNomeCidade(nomeBanco);
  
  console.log('=== COMPARAÇÃO ===');
  console.log('Frontend original:', nomeFrontend);
  console.log('Banco original:', nomeBanco);
  console.log('Frontend normalizado:', frontendNormalizado);
  console.log('Banco normalizado:', bancoNormalizado);
  console.log('São iguais?', frontendNormalizado === bancoNormalizado);
  
  return frontendNormalizado === bancoNormalizado;
};
```

## 📋 Checklist de Verificação

### Antes de Reportar um Bug

- [ ] **Testei a normalização no console**
- [ ] **Verifiquei se a cidade existe no banco**
- [ ] **Comparei os nomes normalizados**
- [ ] **Testei a requisição da API**
- [ ] **Verifiquei os logs do backend**

### Para Adicionar Nova Cidade

- [ ] **A cidade tem caracteres especiais?**
- [ ] **A cidade tem "Do" no nome?**
- [ ] **A cidade tem acentos?**
- [ ] **Precisa de tratamento específico?**

## 🆘 Casos Especiais

### 1. **Cidades com Hífen**
```javascript
// Exemplo: "São José do Rio Claro"
// Normalização automática deve funcionar
```

### 2. **Cidades com Números**
```javascript
// Exemplo: "1º de Maio"
// Verificar se números são preservados
```

### 3. **Cidades com Abreviações**
```javascript
// Exemplo: "Dr. Antônio"
// Verificar se abreviações são tratadas
```

## 📞 Contato e Suporte

### Informações Necessárias para Reportar Problema

1. **Nome da cidade problemática**
2. **Como deveria aparecer**
3. **Como está aparecendo**
4. **Logs do console**
5. **Resposta da API**

### Exemplo de Report

```
PROBLEMA: Cidade "Nova Cidade" não aparece no gráfico

DETALHES:
- Nome original: "Nova Cidade"
- Normalizado: "NOVA CIDADE"
- Esperado no banco: "NOVA CIDADE"
- Resposta da API: []

LOGS:
[Console logs aqui]

SOLUÇÃO SUGERIDA:
[Se tiver alguma ideia]
```

## 🔄 Manutenção

### Atualizar Função de Normalização

Se precisar adicionar um novo caso especial:

1. **Editar** `src/utils/SGPM/helpers.ts`
2. **Adicionar** o tratamento na função `normalizarNomeCidade`
3. **Testar** com a nova cidade
4. **Documentar** o novo caso
5. **Atualizar** este guia se necessário

### Exemplo de Adição:
```typescript
// Tratamento específico para Nova Cidade
if (normalizada === 'NOVA CIDADE') {
  normalizada = 'NOVA_CIDADE';
}
```

---

**Última Atualização**: Dezembro 2024  
**Versão**: 1.0  
**Manutenido por**: Equipe de Desenvolvimento
