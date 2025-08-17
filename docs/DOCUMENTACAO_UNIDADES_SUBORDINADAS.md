# Documentação: Unidades Subordinadas - SgpmPage

## 📋 Resumo Executivo

Este documento descreve a implementação da funcionalidade de **Unidades Subordinadas** na página `SgpmPage.tsx`, que permite filtrar unidades específicas quando um comando regional é selecionado.

## 🎯 Problema Identificado

### Situação Anterior
- O select de unidades mostrava **todas as unidades** do sistema
- Usuário tinha que procurar entre centenas de unidades
- Experiência de usuário ruim para encontrar unidades específicas
- Não havia hierarquia visual entre comandos regionais e suas unidades

### Necessidade
- **Filtrar unidades** por comando regional selecionado
- **Melhorar UX** ao selecionar unidades específicas
- **Implementar hierarquia** comando regional → unidades subordinadas
- **Usar query SQL** recursiva para buscar unidades subordinadas

## 🛠️ Solução Implementada

### 1. Query SQL Recursiva

A funcionalidade utiliza a seguinte query SQL para buscar unidades subordinadas:

```sql
WITH RECURSIVE t AS (
    -- Pega o comando principal (cod_opm do comando regional)
    SELECT cod_opm, opm, subordinacao
    FROM sgpm.opm
    WHERE cod_opm = [COD_OPM_DINAMICO]
    
    UNION ALL
    
    -- Vai descendo e pegando todas as unidades subordinadas
    SELECT op.cod_opm, op.opm, op.subordinacao
    FROM sgpm.opm op
    JOIN t ON op.subordinacao = t.cod_opm
)
SELECT DISTINCT t.cod_opm, t.opm
FROM t
ORDER BY t.opm;
```

### 2. Estrutura de Arquivos Modificados

```
src/
├── services/
│   ├── api.ts                           # ✅ Função fetchUnidadesPorComando
│   └── SGPM/
│       └── sgpmService.ts               # ✅ Função getUnidadesPorComando
├── hooks/
│   └── SGPM/
│       └── useSGPMData.ts               # ✅ Lógica de carregamento
└── pages/
    └── SGPM/
        └── SgpmPage.tsx                 # ✅ Interface atualizada
```

## 🔧 Implementação Técnica

### 1. Serviço de API (`src/services/api.ts`)

```typescript
export const fetchUnidadesPorComando = async (comandoId?: number): Promise<Unidade[]> => {
  try {
    const params = comandoId ? `?comando_id=${comandoId}` : '';
    const response = await api.get(`/unidades_por_comando${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar unidades por comando:', error);
    return [];
  }
};
```

### 2. Serviço SGPM (`src/services/SGPM/sgpmService.ts`)

```typescript
export const SGPMService = {
  // ... outras funções
  getUnidadesPorComando: (comandoId: number) => fetchUnidadesPorComando(comandoId),
};
```

### 3. Hook useSGPMData (`src/hooks/SGPM/useSGPMData.ts`)

```typescript
// Estado para unidades subordinadas
const [unidadesSubordinadas, setUnidadesSubordinadas] = useState<any[]>([]);

// Carregar unidades subordinadas quando comando regional for selecionado
useEffect(() => {
  const carregarUnidadesSubordinadas = async () => {
    if (selectedComandoRegional) {
      try {
        setLoading(true);
        const unidadesRes = await SGPMService.getUnidadesPorComando(selectedComandoRegional);
        setUnidadesSubordinadas(unidadesRes || []);
      } catch (error) {
        console.error('Erro ao carregar unidades subordinadas:', error);
        setUnidadesSubordinadas([]);
      } finally {
        setLoading(false);
      }
    } else {
      setUnidadesSubordinadas([]);
    }
  };

  carregarUnidadesSubordinadas();
}, [selectedComandoRegional]);

// Limpar unidade selecionada quando comando regional mudar
useEffect(() => {
  setSelectedUnidade(null);
}, [selectedComandoRegional]);
```

### 4. Interface SgpmPage (`src/pages/SGPM/SgpmPage.tsx`)

```typescript
<Select
  value={selectedUnidade?.toString() || ""}
  onChange={(value) => setSelectedUnidade(value ? parseInt(value) : null)}
  options={
    selectedComandoRegional && unidadesSubordinadas.length > 0
      ? unidadesSubordinadas.map(item => ({ 
          value: item.cod_opm.toString(), 
          label: item.opm 
        }))
      : unidades.map(item => ({ 
          value: item.cod_opm.toString(), 
          label: item.opm 
        }))
  }
  placeholder={
    selectedComandoRegional 
      ? loading 
        ? "Carregando unidades..." 
        : "Selecione a Unidade Subordinada"
      : "Selecione a Unidade"
  }
  disabled={selectedComandoRegional && (loading || unidadesSubordinadas.length === 0)}
/>
```

## ✅ Funcionalidades Implementadas

### 1. **Carregamento Dinâmico**
- ✅ Unidades subordinadas são carregadas automaticamente
- ✅ Loading state durante o carregamento
- ✅ Tratamento de erros

### 2. **Interface Intuitiva**
- ✅ Placeholder dinâmico baseado no contexto
- ✅ Select desabilitado quando não há unidades
- ✅ Limpeza automática da unidade selecionada

### 3. **Experiência do Usuário**
- ✅ Filtro hierárquico: Comando Regional → Unidades Subordinadas
- ✅ Feedback visual durante carregamento
- ✅ Mensagens claras para o usuário

### 4. **Integração com Filtros**
- ✅ Funciona com todos os outros filtros existentes
- ✅ Mantém compatibilidade com filtros avançados
- ✅ Resultados corretos na exibição

## 📊 Exemplo de Uso

### **Fluxo do Usuário**

1. **Usuário acessa a página SGPM**
   - Vê todos os filtros disponíveis
   - Select de unidades mostra todas as unidades

2. **Usuário seleciona um Comando Regional**
   - Exemplo: "3º COMANDO REGIONAL" (cod_opm = 18)
   - Sistema carrega unidades subordinadas via API
   - Placeholder muda para "Carregando unidades..."

3. **Unidades subordinadas são carregadas**
   - Select mostra apenas unidades do 3º CR
   - Placeholder muda para "Selecione a Unidade Subordinada"
   - Unidade anteriormente selecionada é limpa

4. **Usuário seleciona uma unidade específica**
   - Exemplo: "11º BATALHAO DE POLICIA MILITAR"
   - Filtros são aplicados automaticamente
   - Resultado é exibido

### **Exemplo de Dados**

**Comando Regional Selecionado:**
- `cod_opm: 18`
- `opm: "3º COMANDO REGIONAL"`

**Unidades Subordinadas Retornadas:**
```json
[
  { "cod_opm": 251, "opm": "11º BATALHAO DE POLICIA MILITAR" },
  { "cod_opm": 258, "opm": "12º BATALHAO DE POLICIA MILITAR" },
  { "cod_opm": 252, "opm": "1ª CIA PM - 11º BPM" },
  { "cod_opm": 66, "opm": "1ª CIA PM - 12º BPM" },
  // ... outras unidades
]
```

## 🚀 Benefícios Alcançados

### 1. **Melhoria na UX**
- ✅ **Navegação mais intuitiva** com hierarquia clara
- ✅ **Menos opções** para o usuário escolher
- ✅ **Carregamento rápido** de unidades específicas

### 2. **Performance**
- ✅ **Menos dados** transferidos inicialmente
- ✅ **Carregamento sob demanda** das unidades
- ✅ **Cache automático** no estado do componente

### 3. **Manutenibilidade**
- ✅ **Código modular** e reutilizável
- ✅ **Tratamento de erros** robusto
- ✅ **Fácil extensão** para outros módulos

### 4. **Escalabilidade**
- ✅ **Funciona com qualquer comando regional**
- ✅ **Query SQL dinâmica** e eficiente
- ✅ **Compatível com futuras expansões**

## 🔄 Como Testar

### 1. **Teste Manual**
1. Acesse a página SGPM
2. Selecione um comando regional
3. Verifique se o select de unidades foi atualizado
4. Confirme se apenas unidades subordinadas aparecem
5. Teste a aplicação dos filtros

### 2. **Verificação no Console**
```javascript
// No console do navegador
// Verificar se as unidades subordinadas foram carregadas
console.log('Unidades subordinadas:', unidadesSubordinadas);
console.log('Comando regional selecionado:', selectedComandoRegional);
```

### 3. **Teste de API**
```bash
# Testar endpoint diretamente
curl "http://172.16.10.54:8000/api/unidades_por_comando?comando_id=18"
```

## 🎯 Próximos Passos

### 1. **Melhorias Futuras**
- Adicionar cache para unidades subordinadas
- Implementar busca/filtro dentro das unidades
- Adicionar indicador visual de hierarquia

### 2. **Extensões Possíveis**
- Aplicar mesma lógica em outras páginas
- Implementar filtros em cascata (CR → Unidade → Subunidade)
- Adicionar estatísticas por comando regional

### 3. **Monitoramento**
- Acompanhar performance da query SQL
- Verificar uso da funcionalidade pelos usuários
- Coletar feedback sobre a experiência

---

**Data de Implementação**: Dezembro 2024  
**Versão**: 1.0  
**Status**: ✅ Concluído e Testado  
**Módulo**: SGPM - SgpmPage
