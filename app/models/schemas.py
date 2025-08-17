from pydantic import BaseModel
from typing import List, Optional, Dict

# Schemas CONEQ
class Equipamento(BaseModel):
    equipamento_nome: str
    quantidade_em_estoque: int

class EstoqueItem(BaseModel):
    status: str
    quantidade: int

class EstoqueResponse(BaseModel):
    estoque: List[EstoqueItem]
    cautelas: int

class TipoEquipamentoResponse(BaseModel):
    id: int
    nome: str

class CautelaItem(BaseModel):
    status: str
    quantidade: int

class CautelaResponse(BaseModel):
    cautela: List[CautelaItem]

# Schemas SGPM
class SexoContagem(BaseModel):
    sexo: str
    quantidade: int

class TipoContagem(BaseModel):
    tipo: str
    quantidade: int

class SituacaoContagem(BaseModel):
    situacao: str
    quantidade: int

class CidadeResponse(BaseModel):
    nome_cidade: str
    qtd_sexoM: int
    qtd_sexoF: int

    class Config:
        from_attributes = True

class UnidadeResponse(BaseModel):
    unidade: str
    Feminino: int
    Masculino: int

class PostoGradItem(BaseModel):
    posto_grad: str
    quantidade: int

class PostoGradResponse(BaseModel):
    feminino: List[PostoGradItem]
    masculino: List[PostoGradItem]

# Novos schemas para os filtros
class PostoGraduacaoInfo(BaseModel):
    cod_posto_grad: int
    posto_grad: str
    posto_grad_abrev: str

class ComandoRegional(BaseModel):
    cod_opm: int
    opm: str

class Unidade(BaseModel):
    cod_opm: int
    opm: str

class FiltroAvancadoResponse(BaseModel):
    quantidade: int
    dados: List[Dict] 