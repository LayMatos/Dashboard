from pydantic import BaseModel
from typing import List

class Equipamento(BaseModel):
    equipamento_nome: str
    quantidade_em_estoque: int

class TipoEquipamentoResponse(BaseModel):
    id: int
    nome: str

class EstoqueItem(BaseModel):
    status: str
    quantidade: int

class EstoqueResponse(BaseModel):
    estoque: List[EstoqueItem]
    cautelas: int

class CautelaItem(BaseModel):
    status: str
    quantidade: int

class CautelaResponse(BaseModel):
    cautela: List[CautelaItem] 