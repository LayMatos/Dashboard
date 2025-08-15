from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional

from ..models.sgpm import (
    SexoContagem,
    TipoContagem,
    SituacaoContagem,
    CidadeResponse,
    UnidadeResponse
)
from ..services.sgpm import (
    ler_qtd_sexo,
    tipo_policial,
    situacao_policial,
    contar_por_posto_grad_sexo,
    filtrar_policiais,
    contar_sexo_por_unidade,
    contar_sexo_por_cidade
)

router = APIRouter(prefix="/api", tags=["sgpm"])

@router.get("/policiais_sexo", response_model=List[SexoContagem])
async def obter_sexo_policiais():
    """Endpoint para obter a quantidade de policiais por sexo."""
    dados_sexo = ler_qtd_sexo()
    if not dados_sexo:
        raise HTTPException(status_code=500, detail="Erro ao buscar os dados de sexo dos policiais")
    return dados_sexo

@router.get("/policiais_tipo", response_model=List[TipoContagem])
async def obter_tipo_policiais():
    """Endpoint para obter a quantidade de policiais por tipo."""
    dados_tipo = tipo_policial()
    if not dados_tipo:
        raise HTTPException(status_code=500, detail="Erro ao buscar os dados de tipo dos policiais")
    return dados_tipo

@router.get("/policiais_situacao", response_model=List[SituacaoContagem])
async def obter_situacao_policiais():
    """Endpoint para obter a quantidade de policiais por situação."""
    dados_situacao = situacao_policial()
    if not dados_situacao:
        raise HTTPException(status_code=500, detail="Erro ao buscar os dados de situação dos policiais")
    return dados_situacao

@router.get("/dados_posto_grad")
async def dados_posto_grad():
    """Endpoint para obter dados de posto/graduação por sexo."""
    try:
        # Chama a função que retorna os dados do banco
        dados = contar_por_posto_grad_sexo()
        
        # Mapeamento correto dos postos
        postos = [
            'Soldado', 'Cabo', '3º Sargento', '2º Sargento', '1º Sargento', 
            'Sub-Tenente', 'Aspirante', '2º Tenente', '1º Tenente', 
            'Capitão', 'Major', 'Tenente Coronel', 'Coronel'
        ]
        
        # Inicializando contadores para cada sexo
        feminino = [0] * len(postos)
        masculino = [0] * len(postos)
        ordens = [0] * len(postos)

        # Preenche os dados de cada sexo
        for item in dados:
            posto_grad = item['posto_grad'].title()  # Converte para o formato correto
            sexo = item['sexo']
            quantidade = item['quantidade']
            ordem = item['ordem']
            
            # Encontra o índice do posto na lista
            try:
                index = postos.index(posto_grad)
                if sexo == 'F':
                    feminino[index] = quantidade
                elif sexo == 'M':
                    masculino[index] = quantidade
                ordens[index] = ordem
            except ValueError:
                # Se o posto não estiver na lista, ignora
                continue

        # Formata os dados no formato esperado pelo Pydantic model
        dados_formatados = {
            "feminino": [
                {"posto_grad": posto, "quantidade": qtd, "ordem": ord}
                for posto, qtd, ord in zip(postos, feminino, ordens)
            ],
            "masculino": [
                {"posto_grad": posto, "quantidade": qtd, "ordem": ord}
                for posto, qtd, ord in zip(postos, masculino, ordens)
            ],
            "totais": [
                {"posto_grad": posto, "total": fem + masc, "ordem": ord}
                for posto, fem, masc, ord in zip(postos, feminino, masculino, ordens)
            ]
        }

        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar os dados: {e}")
        return {
            "feminino": [],
            "masculino": [],
            "totais": []
        }

@router.get("/policiais_filtro")
async def filtrar_policiais_endpoint(
    sexo: Optional[str] = Query(None), 
    situacao: Optional[str] = Query(None), 
    tipo: Optional[str] = Query(None)
):
    """Endpoint para filtrar policiais por sexo, situação e tipo."""
    resultado = filtrar_policiais(sexo, situacao, tipo)
    if "error" in resultado:
        raise HTTPException(status_code=500, detail=resultado["error"])
    return resultado

@router.get("/contar_sexo_por_unidade", response_model=List[UnidadeResponse])
async def contar_sexo_por_unidade_endpoint(cidade: str = Query(...)):
    """Endpoint para contar policiais por sexo e unidade em uma cidade específica."""
    dados = contar_sexo_por_unidade(cidade)
    if not dados:
        raise HTTPException(status_code=404, detail="Nenhum dado encontrado para a cidade especificada")
    return dados 

@router.get("/api/contar_sexo_por_cidade")
async def contar_sexo_por_cidade(
    cidades: Optional[List[str]] = Query(None),
    request: Request = None,
):
    if cidades is None:
        cidades = request.query_params.getlist("cidades[]")
    # Agora cidades sempre é lista ou []
    return {"cidades": cidades or []}