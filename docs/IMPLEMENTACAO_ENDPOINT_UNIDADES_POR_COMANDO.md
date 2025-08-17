# Implementação: Endpoint unidades_por_comando

## 🐛 Problema Identificado

**Erro**: `404 Not Found` ao tentar acessar `/api/unidades_por_comando`
**Causa**: O endpoint não estava implementado no backend

## ✅ Solução Implementada

### 1. **Modelo** (`app/models/sgpm_model.py`)

Adicionado método `get_unidades_por_comando`:

```python
def get_unidades_por_comando(self, comando_id: int) -> List[Dict]:
    """Retorna todas as unidades subordinadas a um comando regional específico."""
    query = """
    WITH RECURSIVE t AS (
        -- Pega o comando principal (cod_opm do comando regional)
        SELECT cod_opm, opm, subordinacao
        FROM sgpm.opm
        WHERE cod_opm = %s
        
        UNION ALL
        
        -- Vai descendo e pegando todas as unidades subordinadas
        SELECT op.cod_opm, op.opm, op.subordinacao
        FROM sgpm.opm op
        JOIN t ON op.subordinacao = t.cod_opm
    )
    SELECT DISTINCT t.cod_opm, t.opm
    FROM t
    ORDER BY t.opm;
    """
    try:
        results = self.execute_query(query, (comando_id,))
        if not results:
            return []
        return [
            {
                "cod_opm": row[0],
                "opm": row[1]
            } 
            for row in results
        ]
    except Exception as e:
        print(f"Erro ao buscar unidades por comando {comando_id}: {str(e)}")
        return []
```

### 2. **Controller** (`app/controllers/sgpm_controller.py`)

Adicionado método `get_unidades_por_comando`:

```python
def get_unidades_por_comando(self, comando_id: int) -> List[Dict]:
    """Retorna todas as unidades subordinadas a um comando regional específico."""
    try:
        dados = self.model.get_unidades_por_comando(comando_id)
        if not dados:
            return []  # Retorna lista vazia se não houver unidades subordinadas
        return dados
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar unidades por comando: {str(e)}"
        )
```

### 3. **Rotas** (`app/routes/sgpm_routes.py`)

Adicionado endpoint `/unidades_por_comando`:

```python
@router.get("/unidades_por_comando", response_model=List[Unidade])
async def obter_unidades_por_comando(comando_id: int = Query(...)):
    """Endpoint para retornar todas as unidades subordinadas a um comando regional."""
    return controller.get_unidades_por_comando(comando_id)
```

## 🔧 Como Testar

### 1. **Reiniciar o Servidor Backend**

O servidor backend precisa ser reiniciado para carregar as novas rotas:

```bash
# Parar o servidor atual (Ctrl+C)
# Reiniciar o servidor
cd app
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. **Testar o Endpoint**

```bash
# Testar com comando regional ID 18 (3º COMANDO REGIONAL)
curl -X GET "http://172.16.10.54:8000/api/unidades_por_comando?comando_id=18"

# Ou usando PowerShell
Invoke-WebRequest -Uri "http://172.16.10.54:8000/api/unidades_por_comando?comando_id=18" -Method GET
```

### 3. **Resposta Esperada**

```json
[
  {
    "cod_opm": 251,
    "opm": "11º BATALHAO DE POLICIA MILITAR"
  },
  {
    "cod_opm": 258,
    "opm": "12º BATALHAO DE POLICIA MILITAR"
  },
  {
    "cod_opm": 252,
    "opm": "1ª CIA PM - 11º BPM"
  }
  // ... outras unidades subordinadas
]
```

## 🎯 Query SQL Implementada

A query recursiva implementada segue exatamente o padrão fornecido pelo usuário:

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

## 📊 Estrutura de Arquivos Modificados

```
app/
├── models/
│   └── sgpm_model.py           # ✅ Método get_unidades_por_comando
├── controllers/
│   └── sgpm_controller.py      # ✅ Método get_unidades_por_comando
└── routes/
    └── sgpm_routes.py          # ✅ Endpoint /unidades_por_comando
```

## 🚀 Próximos Passos

### 1. **Reiniciar Servidor**
- Parar o servidor backend atual
- Reiniciar com `uvicorn main:app --reload`

### 2. **Testar Frontend**
- Após reiniciar, testar a funcionalidade no frontend
- Verificar se o select de unidades funciona corretamente

### 3. **Verificar Logs**
- Monitorar logs do servidor para erros
- Verificar se a query SQL está funcionando

## ✅ Status da Implementação

- ✅ **Modelo**: Implementado
- ✅ **Controller**: Implementado  
- ✅ **Rotas**: Implementado
- ⏳ **Servidor**: Precisa ser reiniciado
- ⏳ **Teste**: Aguardando reinicialização

---

**Data de Implementação**: Dezembro 2024  
**Versão**: 1.0  
**Status**: ✅ Implementado (Aguardando reinicialização do servidor)  
**Módulo**: Backend - SGPM
