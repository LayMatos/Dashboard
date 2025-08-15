from fastapi import APIRouter, Query
from typing import List, Dict
from app.controllers.coneq_controller import ConeqController
from app.models.schemas import Equipamento, EstoqueResponse, TipoEquipamentoResponse, CautelaResponse

router = APIRouter(prefix="/api", tags=["CONEQ"])
controller = ConeqController()

@router.get("/estoque", response_model=List[Equipamento])
async def obter_estoque():
    """Endpoint para retornar os dados de estoque."""
    return controller.get_estoque()

@router.get("/estoque_geral", response_model=EstoqueResponse)
async def get_estoque_geral():
    """Endpoint para retornar os dados gerais de estoque."""
    return controller.get_estoque_geral()

@router.get("/estoqueDado/{tipo_equipamento_id}", response_model=EstoqueResponse)
async def get_estoque_dado(tipo_equipamento_id: int):
    """Endpoint para retornar os dados de estoque com status."""
    return controller.get_estoque_por_tipo(tipo_equipamento_id)

@router.get("/status_counts/{tipo_equipamento_id}", response_model=CautelaResponse)
async def get_cautela_dado(tipo_equipamento_id: int, status: str = "todos"):
    """Endpoint para retornar os dados de cautela por tipo de equipamento."""
    return controller.get_cautela_por_tipo(tipo_equipamento_id, status)

@router.get("/cautela_geral", response_model=CautelaResponse)
async def get_cautela_geral():
    """Endpoint para retornar os dados gerais de cautela."""
    return controller.get_cautela_por_tipo(0, "todos")  # 0 como ID indica todos os tipos

@router.get("/TipoEquipamentos", response_model=List[TipoEquipamentoResponse])
async def tipo_equipamentos():
    """Endpoint para retornar os tipos de equipamentos."""
    return controller.get_tipos_equipamento()

@router.get("/quantitativoPorCidade")
async def get_quantitativo_por_cidade(cidades: str = Query(...)):
    """Endpoint para retornar o quantitativo por cidade."""
    return controller.get_cautelas_por_cidade(cidades)

@router.get("/contar_entregas_por_cidade")
async def get_entregas_por_cidade(cidades: str = Query(...)):
    """Endpoint para retornar o número de entregas por cidade."""
    return controller.get_entregas_por_cidade(cidades) 