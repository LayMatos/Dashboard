# 🚀 Guia para Implementar Novas Funcionalidades

## 📋 **Índice**
1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
3. [Implementando um Novo Endpoint](#implementando-um-novo-endpoint)
4. [Exemplos Práticos](#exemplos-práticos)
5. [Boas Práticas](#boas-práticas)
6. [Testando](#testando)

---

## 🏗️ **Estrutura do Projeto**

### **Backend (FastAPI)**
```
app/
├── main.py                 # Aplicação principal
├── config.py              # Configurações
├── controllers/           # Lógica de negócio
│   ├── __init__.py
│   ├── sgpm_controller.py
│   └── coneq_controller.py
├── models/               # Modelos e queries
│   ├── __init__.py
│   ├── base_model.py
│   ├── sgpm_model.py
│   └── coneq_model.py
├── routes/               # Endpoints
│   ├── __init__.py
│   ├── sgpm_routes.py
│   └── coneq_routes.py
├── utils/                # Utilitários
│   ├── __init__.py
│   └── string_utils.py
└── schemas.py            # Schemas Pydantic
```

### **Frontend (React)**
```
src/
├── components/           # Componentes reutilizáveis
├── pages/               # Páginas da aplicação
├── services/            # Serviços da API
├── hooks/               # Hooks customizados
├── types/               # Definições TypeScript
└── utils/               # Utilitários
```

---

## 🔄 **Fluxo de Desenvolvimento**

### **1. Planejamento**
- [ ] Definir requisitos da funcionalidade
- [ ] Identificar tabelas do banco necessárias
- [ ] Definir estrutura da resposta da API
- [ ] Planejar interface do usuário

### **2. Backend**
- [ ] Criar/atualizar schema Pydantic
- [ ] Implementar query no modelo
- [ ] Criar método no controller
- [ ] Definir endpoint na rota
- [ ] Testar endpoint

### **3. Frontend**
- [ ] Criar/atualizar tipos TypeScript
- [ ] Implementar serviço da API
- [ ] Criar hook se necessário
- [ ] Implementar componente/página
- [ ] Testar interface

---

## 🛠️ **Implementando um Novo Endpoint**

### **Exemplo: Endpoint para Dados por Idade**

#### **1. Definir Schema (app/schemas.py)**
```python
from pydantic import BaseModel
from typing import List

class IdadeContagem(BaseModel):
    faixa_etaria: str
    quantidade: int

class IdadeResponse(BaseModel):
    dados: List[IdadeContagem]
    total: int
```

#### **2. Implementar Query (app/models/sgpm_model.py)**
```python
def get_policiais_por_idade(self) -> List[Dict]:
    """Retorna a contagem de policiais por faixa etária."""
    query = """
    SELECT 
        CASE 
            WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) < 25 THEN '18-24'
            WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) < 35 THEN '25-34'
            WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) < 45 THEN '35-44'
            WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) < 55 THEN '45-54'
            ELSE '55+'
        END as faixa_etaria,
        COUNT(*) as quantidade
    FROM sgpm.policial p
    WHERE p.cod_policial_tipo = 1
    GROUP BY faixa_etaria
    ORDER BY faixa_etaria;
    """
    
    try:
        results = self.execute_query(query)
        if not results:
            return []
        return [
            {
                "faixa_etaria": row[0],
                "quantidade": row[1]
            } 
            for row in results
        ]
    except Exception as e:
        print(f"Erro ao buscar dados por idade: {str(e)}")
        return []
```

#### **3. Implementar Controller (app/controllers/sgpm_controller.py)**
```python
def get_policiais_por_idade(self) -> List[Dict]:
    """Retorna a contagem de policiais por faixa etária."""
    try:
        dados = self.model.get_policiais_por_idade()
        if not dados:
            return []
        return dados
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar dados por idade: {str(e)}"
        )
```

#### **4. Definir Rota (app/routes/sgpm_routes.py)**
```python
from app.models.schemas import IdadeContagem

@router.get("/policiais_idade", response_model=List[IdadeContagem])
async def obter_idade_policiais():
    """Endpoint para retornar os dados de idade dos policiais."""
    return controller.get_policiais_por_idade()
```

#### **5. Atualizar Schemas (app/models/schemas.py)**
```python
class IdadeContagem(BaseModel):
    faixa_etaria: str
    quantidade: int
```

---

## 📊 **Exemplos Práticos**

### **Exemplo 1: Endpoint com Filtros**

#### **Backend**
```python
# Model
def get_policiais_por_faixa_etaria(self, idade_min: int = None, idade_max: int = None) -> List[Dict]:
    query = """
    SELECT 
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) as idade,
        COUNT(*) as quantidade
    FROM sgpm.policial p
    WHERE p.cod_policial_tipo = 1
    """
    params = []
    
    if idade_min is not None:
        query += " AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) >= %s"
        params.append(idade_min)
    
    if idade_max is not None:
        query += " AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento)) <= %s"
        params.append(idade_max)
    
    query += " GROUP BY idade ORDER BY idade"
    
    results = self.execute_query(query, tuple(params))
    return [{"idade": row[0], "quantidade": row[1]} for row in results]

# Controller
def get_policiais_por_faixa_etaria(self, idade_min: int = None, idade_max: int = None) -> List[Dict]:
    try:
        return self.model.get_policiais_por_faixa_etaria(idade_min, idade_max)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route
@router.get("/policiais_faixa_etaria")
async def obter_faixa_etaria_policiais(
    idade_min: int = Query(None, description="Idade mínima"),
    idade_max: int = Query(None, description="Idade máxima")
):
    return controller.get_policiais_por_faixa_etaria(idade_min, idade_max)
```

#### **Frontend**
```typescript
// types/sgpm.ts
export interface FaixaEtaria {
  idade: number;
  quantidade: number;
}

// services/api.ts
export const fetchPoliciaisPorFaixaEtaria = async (
  idadeMin?: number,
  idadeMax?: number
): Promise<FaixaEtaria[]> => {
  try {
    const params = new URLSearchParams();
    if (idadeMin) params.append("idade_min", idadeMin.toString());
    if (idadeMax) params.append("idade_max", idadeMax.toString());
    
    const response = await api.get(`/policiais_faixa_etaria?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados por faixa etária:', error);
    return [];
  }
};

// services/SGPM/sgpmService.ts
export const SGPMService = {
  // ... outros métodos
  getPoliciaisPorFaixaEtaria: (idadeMin?: number, idadeMax?: number) => 
    fetchPoliciaisPorFaixaEtaria(idadeMin, idadeMax),
};
```

### **Exemplo 2: Endpoint com Agregação Complexa**

#### **Backend**
```python
# Model
def get_estatisticas_gerais(self) -> Dict:
    """Retorna estatísticas gerais do efetivo."""
    query = """
    SELECT 
        COUNT(*) as total_policiais,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as total_masculino,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as total_feminino,
        AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.data_nascimento))) as idade_media,
        COUNT(CASE WHEN ps.situacao = 'ATIVA' THEN 1 END) as ativos,
        COUNT(CASE WHEN ps.situacao != 'ATIVA' THEN 1 END) as inativos
    FROM sgpm.policial p
    JOIN sgpm.policial_situacao ps ON p.cod_policial_situacao = ps.cod_policial_situacao
    WHERE p.cod_policial_tipo = 1;
    """
    
    results = self.execute_query(query)
    if not results:
        return {}
    
    row = results[0]
    return {
        "total_policiais": row[0],
        "total_masculino": row[1],
        "total_feminino": row[2],
        "idade_media": round(row[3], 1) if row[3] else 0,
        "ativos": row[4],
        "inativos": row[5]
    }
```

---

## ✅ **Boas Práticas**

### **1. Nomenclatura**
- **Endpoints**: Use substantivos no plural (`/policiais`, `/unidades`)
- **Métodos**: Use verbos descritivos (`get_policiais_por_idade`)
- **Variáveis**: Use snake_case no Python, camelCase no TypeScript

### **2. Tratamento de Erros**
```python
try:
    # código da query
    results = self.execute_query(query, params)
    if not results:
        return []
    return [{"campo": row[0]} for row in results]
except Exception as e:
    print(f"Erro na query: {str(e)}")
    return []
```

### **3. Validação de Parâmetros**
```python
from fastapi import Query, HTTPException

@router.get("/endpoint")
async def endpoint(
    parametro: str = Query(..., min_length=1, max_length=100)
):
    if not parametro:
        raise HTTPException(status_code=400, detail="Parâmetro obrigatório")
    # resto do código
```

### **4. Documentação**
```python
@router.get("/endpoint", response_model=List[Schema])
async def endpoint():
    """
    Descrição detalhada do endpoint.
    
    Returns:
        List[Schema]: Lista com os dados solicitados
        
    Raises:
        HTTPException: Em caso de erro no servidor
    """
    pass
```

### **5. Performance**
- Use índices no banco de dados
- Limite resultados com `LIMIT`
- Use `WHERE` para filtrar dados
- Evite `SELECT *`

---

## 🧪 **Testando**

### **1. Teste do Endpoint**
```bash
# Testar endpoint
curl http://localhost:8000/api/novo_endpoint

# Testar com parâmetros
curl "http://localhost:8000/api/novo_endpoint?parametro=valor"
```

### **2. Teste no Frontend**
```typescript
// Testar serviço
const dados = await SGPMService.novoMetodo();
console.log('Dados:', dados);

// Testar hook
const { dados, loading, error } = useNovoHook();
```

### **3. Verificar Logs**
```bash
# Logs do backend
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Logs do frontend
npm start
```

---

## 📝 **Checklist de Implementação**

### **Backend**
- [ ] Schema Pydantic criado
- [ ] Query SQL implementada
- [ ] Método no modelo criado
- [ ] Método no controller criado
- [ ] Endpoint na rota definido
- [ ] Tratamento de erros implementado
- [ ] Documentação adicionada
- [ ] Testado localmente

### **Frontend**
- [ ] Tipos TypeScript criados
- [ ] Serviço da API implementado
- [ ] Hook criado (se necessário)
- [ ] Componente/página implementado
- [ ] Integração testada
- [ ] Interface responsiva

### **Geral**
- [ ] Código revisado
- [ ] Testes realizados
- [ ] Documentação atualizada
- [ ] Deploy realizado

---

## 🔗 **Recursos Úteis**

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **React Docs**: https://reactjs.org/docs/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

## 📞 **Suporte**

Para dúvidas sobre implementação:
1. Consulte a documentação da API
2. Verifique exemplos existentes no código
3. Teste endpoints no Swagger UI (`/docs`)
4. Consulte os logs do servidor
