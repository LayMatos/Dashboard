from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict

from ..models.coneq import (
    Equipamento,
    TipoEquipamentoResponse,
    EstoqueResponse,
    CautelaResponse
)
from ..services.coneq import (
    ler_qtd_estoque,
    ler_tipo_equipamentos,
    ler_qtd_estoque_por_tipo,
    ler_qtd_cautela_por_tipo
)

router = APIRouter(prefix="/api", tags=["coneq"])

@router.get("/estoque", response_model=List[Equipamento])
async def obter_estoque():
    """Endpoint para obter a quantidade em estoque por tipo de equipamento."""
    dados_estoque = ler_qtd_estoque()
    if not dados_estoque:
        raise HTTPException(status_code=500, detail="Erro ao buscar os dados do estoque")
    return dados_estoque

@router.get("/TipoEquipamentos", response_model=List[TipoEquipamentoResponse])
async def tipo_equipamentos():
    """Endpoint para obter todos os tipos de equipamentos."""
    tipos = ler_tipo_equipamentos()
    if not tipos:
        raise HTTPException(status_code=500, detail="Erro ao buscar os tipos de equipamentos")
    return tipos

@router.get("/estoqueDado/{tipo_equipamento_id}", response_model=EstoqueResponse)
async def get_estoque_dado(tipo_equipamento_id: int):
    """Endpoint para obter a quantidade em estoque por tipo específico de equipamento."""
    dados = ler_qtd_estoque_por_tipo(tipo_equipamento_id)
    if not dados["estoque"]:
        raise HTTPException(status_code=404, detail="Nenhum dado encontrado para o tipo de equipamento especificado")
    return dados

@router.get("/status_counts/{tipo_equipamento_id}", response_model=CautelaResponse)
async def get_cautela_dado(tipo_equipamento_id: int, status: str = "todos"):
    """Endpoint para obter a quantidade de cautelas por tipo de equipamento e status."""
    dados = ler_qtd_cautela_por_tipo(tipo_equipamento_id, status)
    if not dados["cautela"]:
        raise HTTPException(status_code=404, detail="Nenhum dado de cautela encontrado")
    return dados 