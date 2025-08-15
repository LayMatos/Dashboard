# 📝 Templates de Código - Dashboard PMMT

## 🎯 **Templates para Implementação Rápida**

### **1. Template de Endpoint Simples**

#### **Schema (app/models/schemas.py)**
```python
from pydantic import BaseModel
from typing import List

class NovoDado(BaseModel):
    campo1: str
    campo2: int
    campo3: str = None  # opcional

class NovoDadoResponse(BaseModel):
    dados: List[NovoDado]
    total: int
```

#### **Model (app/models/sgpm_model.py)**
```python
def get_novos_dados(self) -> List[Dict]:
    """Retorna dados do novo endpoint."""
    query = """
    SELECT 
        campo1,
        campo2,
        campo3
    FROM tabela
    WHERE condicao = %s
    ORDER BY campo1;
    """
    
    try:
        results = self.execute_query(query, (parametro,))
        if not results:
            return []
        return [
            {
                "campo1": row[0],
                "campo2": row[1],
                "campo3": row[2]
            } 
            for row in results
        ]
    except Exception as e:
        print(f"Erro ao buscar novos dados: {str(e)}")
        return []
```

#### **Controller (app/controllers/sgpm_controller.py)**
```python
def get_novos_dados(self) -> List[Dict]:
    """Retorna dados do novo endpoint."""
    try:
        dados = self.model.get_novos_dados()
        if not dados:
            return []
        return dados
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar novos dados: {str(e)}"
        )
```

#### **Route (app/routes/sgpm_routes.py)**
```python
from app.models.schemas import NovoDado

@router.get("/novos_dados", response_model=List[NovoDado])
async def obter_novos_dados():
    """Endpoint para retornar novos dados."""
    return controller.get_novos_dados()
```

---

### **2. Template de Endpoint com Filtros**

#### **Schema**
```python
class DadoFiltrado(BaseModel):
    id: int
    nome: str
    valor: float
    data: str

class FiltroParams(BaseModel):
    data_inicio: str = None
    data_fim: str = None
    tipo: str = None
```

#### **Model**
```python
def get_dados_filtrados(
    self, 
    data_inicio: str = None, 
    data_fim: str = None, 
    tipo: str = None
) -> List[Dict]:
    """Retorna dados filtrados."""
    query = """
    SELECT 
        id,
        nome,
        valor,
        data
    FROM tabela
    WHERE 1=1
    """
    params = []
    
    if data_inicio:
        query += " AND data >= %s"
        params.append(data_inicio)
    
    if data_fim:
        query += " AND data <= %s"
        params.append(data_fim)
    
    if tipo:
        query += " AND tipo = %s"
        params.append(tipo)
    
    query += " ORDER BY data DESC"
    
    try:
        results = self.execute_query(query, tuple(params))
        return [
            {
                "id": row[0],
                "nome": row[1],
                "valor": row[2],
                "data": row[3].strftime("%Y-%m-%d") if row[3] else None
            } 
            for row in results
        ]
    except Exception as e:
        print(f"Erro ao buscar dados filtrados: {str(e)}")
        return []
```

#### **Controller**
```python
def get_dados_filtrados(
    self, 
    data_inicio: str = None, 
    data_fim: str = None, 
    tipo: str = None
) -> List[Dict]:
    """Retorna dados filtrados."""
    try:
        return self.model.get_dados_filtrados(data_inicio, data_fim, tipo)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar dados filtrados: {str(e)}"
        )
```

#### **Route**
```python
@router.get("/dados_filtrados")
async def obter_dados_filtrados(
    data_inicio: str = Query(None, description="Data de início (YYYY-MM-DD)"),
    data_fim: str = Query(None, description="Data de fim (YYYY-MM-DD)"),
    tipo: str = Query(None, description="Tipo de dado")
):
    """Endpoint para retornar dados filtrados."""
    return controller.get_dados_filtrados(data_inicio, data_fim, tipo)
```

---

### **3. Template de Endpoint com Agregação**

#### **Schema**
```python
class Estatistica(BaseModel):
    categoria: str
    total: int
    percentual: float

class EstatisticasResponse(BaseModel):
    estatisticas: List[Estatistica]
    total_geral: int
    data_atualizacao: str
```

#### **Model**
```python
def get_estatisticas(self) -> Dict:
    """Retorna estatísticas agregadas."""
    query = """
    SELECT 
        categoria,
        COUNT(*) as total,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
    FROM tabela
    WHERE ativo = true
    GROUP BY categoria
    ORDER BY total DESC;
    """
    
    try:
        results = self.execute_query(query)
        if not results:
            return {"estatisticas": [], "total_geral": 0}
        
        estatisticas = [
            {
                "categoria": row[0],
                "total": row[1],
                "percentual": row[2]
            } 
            for row in results
        ]
        
        total_geral = sum(item["total"] for item in estatisticas)
        
        return {
            "estatisticas": estatisticas,
            "total_geral": total_geral,
            "data_atualizacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        print(f"Erro ao buscar estatísticas: {str(e)}")
        return {"estatisticas": [], "total_geral": 0}
```

---

### **4. Template Frontend - TypeScript**

#### **Types (src/types/novo.ts)**
```typescript
export interface NovoDado {
  id: number;
  nome: string;
  valor: number;
  data: string;
}

export interface FiltroParams {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
}

export interface Estatistica {
  categoria: string;
  total: number;
  percentual: number;
}

export interface EstatisticasResponse {
  estatisticas: Estatistica[];
  totalGeral: number;
  dataAtualizacao: string;
}
```

#### **API Service (src/services/api.ts)**
```typescript
// Endpoint simples
export const fetchNovosDados = async (): Promise<NovoDado[]> => {
  try {
    const response = await api.get('/novos_dados');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar novos dados:', error);
    return [];
  }
};

// Endpoint com filtros
export const fetchDadosFiltrados = async (
  params: FiltroParams
): Promise<NovoDado[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.dataInicio) queryParams.append('data_inicio', params.dataInicio);
    if (params.dataFim) queryParams.append('data_fim', params.dataFim);
    if (params.tipo) queryParams.append('tipo', params.tipo);
    
    const response = await api.get(`/dados_filtrados?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados filtrados:', error);
    return [];
  }
};

// Endpoint de estatísticas
export const fetchEstatisticas = async (): Promise<EstatisticasResponse> => {
  try {
    const response = await api.get('/estatisticas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      estatisticas: [],
      totalGeral: 0,
      dataAtualizacao: new Date().toISOString()
    };
  }
};
```

#### **Service (src/services/SGPM/sgpmService.ts)**
```typescript
export const SGPMService = {
  // ... métodos existentes
  
  // Novos métodos
  getNovosDados: () => fetchNovosDados(),
  getDadosFiltrados: (params: FiltroParams) => fetchDadosFiltrados(params),
  getEstatisticas: () => fetchEstatisticas(),
};
```

#### **Hook (src/hooks/useNovosDados.ts)**
```typescript
import { useState, useEffect } from 'react';
import { SGPMService } from '../services/SGPM/sgpmService';
import { NovoDado, FiltroParams } from '../types/novo';

export const useNovosDados = (filtros?: FiltroParams) => {
  const [dados, setDados] = useState<NovoDado[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let resultado;
      if (filtros) {
        resultado = await SGPMService.getDadosFiltrados(filtros);
      } else {
        resultado = await SGPMService.getNovosDados();
      }
      
      setDados(resultado);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro no hook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  return {
    dados,
    loading,
    error,
    recarregar: carregarDados
  };
};
```

#### **Componente (src/components/NovoComponente.tsx)**
```typescript
import React from 'react';
import { useNovosDados } from '../hooks/useNovosDados';
import { NovoDado } from '../types/novo';

interface NovoComponenteProps {
  filtros?: any;
}

export const NovoComponente: React.FC<NovoComponenteProps> = ({ filtros }) => {
  const { dados, loading, error } = useNovosDados(filtros);

  if (loading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Novos Dados</h3>
      
      {dados.length === 0 ? (
        <p className="text-gray-500">Nenhum dado encontrado</p>
      ) : (
        <div className="space-y-2">
          {dados.map((item: NovoDado) => (
            <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
              <span>{item.nome}</span>
              <span className="font-medium">{item.valor}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### **5. Template de Query SQL Complexa**

#### **Query com CTE (Common Table Expression)**
```sql
WITH dados_agregados AS (
    SELECT 
        p.cod_opm,
        o.opm,
        COUNT(*) as total_policiais,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as masculino,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as feminino
    FROM sgpm.policial p
    JOIN sgpm.opm o ON p.cod_opm_lotacao = o.cod_opm
    WHERE p.cod_policial_tipo = 1
    GROUP BY p.cod_opm, o.opm
),
totais_gerais AS (
    SELECT 
        SUM(total_policiais) as total_geral,
        SUM(masculino) as total_masculino,
        SUM(feminino) as total_feminino
    FROM dados_agregados
)
SELECT 
    da.*,
    ROUND(da.total_policiais * 100.0 / tg.total_geral, 2) as percentual
FROM dados_agregados da
CROSS JOIN totais_gerais tg
ORDER BY da.total_policiais DESC;
```

#### **Query com Subconsulta**
```sql
SELECT 
    pg.posto_grad,
    COUNT(*) as quantidade,
    (
        SELECT COUNT(*) 
        FROM sgpm.policial p2 
        WHERE p2.cod_posto_grad = pg.cod_posto_grad 
        AND p2.sexo = 'F'
    ) as feminino,
    (
        SELECT COUNT(*) 
        FROM sgpm.policial p3 
        WHERE p3.cod_posto_grad = pg.cod_posto_grad 
        AND p3.sexo = 'M'
    ) as masculino
FROM sgpm.policial p
JOIN sgpm.posto_grad pg ON p.cod_posto_grad = pg.cod_posto_grad
WHERE p.cod_policial_tipo = 1
GROUP BY pg.posto_grad, pg.cod_posto_grad
ORDER BY pg.ordem;
```

---

### **6. Template de Validação e Tratamento de Erros**

#### **Validação de Parâmetros**
```python
from fastapi import Query, HTTPException
from typing import Optional

@router.get("/endpoint_validado")
async def endpoint_validado(
    parametro1: str = Query(..., min_length=1, max_length=100, description="Parâmetro obrigatório"),
    parametro2: Optional[int] = Query(None, ge=0, le=100, description="Parâmetro opcional (0-100)"),
    data_inicio: Optional[str] = Query(None, regex=r"^\d{4}-\d{2}-\d{2}$", description="Data no formato YYYY-MM-DD")
):
    # Validações adicionais
    if parametro2 and parametro2 > 50:
        raise HTTPException(status_code=400, detail="Parâmetro2 deve ser menor que 50")
    
    if data_inicio:
        try:
            datetime.strptime(data_inicio, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Data inválida")
    
    # Lógica do endpoint
    return controller.metodo_validado(parametro1, parametro2, data_inicio)
```

#### **Tratamento de Erros Robusto**
```python
def metodo_com_tratamento_erros(self, parametro: str) -> List[Dict]:
    """Método com tratamento robusto de erros."""
    if not parametro:
        print("Parâmetro vazio fornecido")
        return []
    
    try:
        # Validação do parâmetro
        if len(parametro) > 100:
            print("Parâmetro muito longo")
            return []
        
        query = """
        SELECT campo1, campo2
        FROM tabela
        WHERE campo1 ILIKE %s
        LIMIT 100;
        """
        
        results = self.execute_query(query, (f"%{parametro}%",))
        
        if not results:
            print("Nenhum resultado encontrado")
            return []
        
        return [
            {
                "campo1": row[0],
                "campo2": row[1] if row[1] else "N/A"
            } 
            for row in results
        ]
        
    except Exception as e:
        print(f"Erro crítico no método: {str(e)}")
        # Log do erro para debugging
        import traceback
        traceback.print_exc()
        return []
```

---

## 🚀 **Como Usar os Templates**

1. **Copie o template desejado**
2. **Substitua os nomes genéricos** pelos nomes específicos do seu endpoint
3. **Adapte as queries SQL** para suas tabelas
4. **Ajuste os tipos TypeScript** conforme necessário
5. **Teste cada camada** separadamente

---

## 📋 **Checklist de Implementação com Templates**

- [ ] Schema Pydantic criado (usando template 1 ou 2)
- [ ] Query SQL implementada (usando template 5)
- [ ] Model com tratamento de erros (usando template 6)
- [ ] Controller implementado
- [ ] Route definida com validações
- [ ] Tipos TypeScript criados
- [ ] Serviço da API implementado
- [ ] Hook criado (se necessário)
- [ ] Componente implementado
- [ ] Testes realizados

---

## 💡 **Dicas de Uso**

- **Mantenha consistência** na nomenclatura
- **Use os templates como base**, mas adapte conforme necessário
- **Teste cada camada** antes de prosseguir
- **Documente mudanças** nos schemas
- **Mantenha logs** para debugging
