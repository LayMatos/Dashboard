from fastapi import APIRouter, Query
from typing import List, Dict
from app.controllers.sgpm_controller import SgpmController
from app.models.schemas import (
    SexoContagem, 
    TipoContagem, 
    SituacaoContagem, 
    CidadeResponse,
    PostoGradResponse
)

router = APIRouter(prefix="/api", tags=["SGPM"])
controller = SgpmController()

@router.get("/policiais_sexo", response_model=List[SexoContagem])
async def obter_sexo_policiais():
    """Endpoint para retornar os dados de sexo dos policiais."""
    return controller.get_policiais_por_sexo()

@router.get("/policiais_tipo", response_model=List[TipoContagem])
async def obter_tipo_policiais():
    """Endpoint para retornar os dados de tipo dos policiais."""
    return controller.get_policiais_por_tipo()

@router.get("/policiais_situacao", response_model=List[SituacaoContagem])
async def obter_situacao_policiais():
    """Endpoint para retornar os dados de situação dos policiais."""
    return controller.get_policiais_por_situacao()

@router.get("/dados_posto_grad", response_model=PostoGradResponse)
async def dados_posto_grad(
    sexo: str = Query(None),
    situacao: str = Query(None),
    tipo: str = Query(None)
):
    """Endpoint para retornar os dados de posto/graduação com filtros opcionais."""
    return controller.get_policiais_por_posto_grad_sexo(sexo, situacao, tipo)

@router.get("/policiais_filtro")
async def filtrar_policiais(
    sexo: str = Query(None), 
    situacao: str = Query(None), 
    tipo: str = Query(None)
):
    """Filtra policiais com base em sexo, situação e tipo"""
    return controller.filtrar_policiais(sexo, situacao, tipo)

@router.get("/totais-por-cr")
async def get_totais_por_cr():
    """Endpoint para retornar o total de policiais por CR."""
    return controller.get_totais_por_cr()

@router.get("/contar_sexo_por_cidade")
async def contar_sexo_por_cidade(cidades: str = Query(...)):
    """Endpoint para retornar a contagem de policiais por sexo e cidade."""
    # Fazer o parsing da string de cidades para uma lista
    cidades_lista = [cidade.strip() for cidade in cidades.split(',')]
    return controller.get_policiais_por_cidade(cidades_lista)

@router.get("/contar_sexo_por_unidade")
async def contar_sexo_por_unidade(cidade: str = Query(...)):
    """Endpoint para retornar a contagem de policiais por sexo e unidade."""
    return controller.get_policiais_por_unidade(cidade) 
