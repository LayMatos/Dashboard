from fastapi import APIRouter, Query
from typing import List, Dict
from app.controllers.sgpm_controller import SgpmController
from app.models.schemas import (
    SexoContagem, 
    TipoContagem, 
    SituacaoContagem, 
    CidadeResponse,
    PostoGradResponse,
    PostoGraduacaoInfo,
    ComandoRegional,
    Unidade,
    FiltroAvancadoResponse
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

# Novos endpoints para os filtros
@router.get("/postos_graduacao_sgpm", response_model=List[PostoGraduacaoInfo])
async def obter_postos_graduacao():
    """Endpoint para retornar todos os postos/graduações disponíveis."""
    return controller.get_postos_graduacao()

@router.get("/unidades_sgpm", response_model=List[Unidade])
async def obter_unidades():
    """Endpoint para retornar todas as unidades disponíveis."""
    return controller.get_unidades()

@router.get("/comandos_regionais", response_model=List[ComandoRegional])
async def obter_comandos_regionais():
    """Endpoint para retornar todos os comandos regionais disponíveis."""
    return controller.get_comandos_regionais()

@router.get("/unidades_por_comando", response_model=List[Unidade])
async def obter_unidades_por_comando(comando_id: int = Query(...)):
    """Endpoint para retornar todas as unidades subordinadas a um comando regional."""
    return controller.get_unidades_por_comando(comando_id)

@router.get("/policiais_filtro_avancado", response_model=FiltroAvancadoResponse)
async def filtrar_policiais_avancado(
    sexo: str = Query(None),
    situacao: str = Query(None),
    tipo: str = Query(None),
    comando_regional: int = Query(None),
    unidade: int = Query(None),
    posto_grad: int = Query(None)
):
    """Filtra policiais com base em todos os filtros disponíveis."""
    return controller.filtrar_policiais_avancado(
        sexo=sexo,
        situacao=situacao,
        tipo=tipo,
        comando_regional=comando_regional,
        unidade=unidade,
        posto_grad=posto_grad
    )

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
