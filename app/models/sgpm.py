from pydantic import BaseModel
from typing import List

class SexoContagem(BaseModel):
    sexo: str
    quantidade: int

class TipoContagem(BaseModel):
    tipo: str
    quantidade: int

class SituacaoContagem(BaseModel):
    situacao: str
    quantidade: int

class UnidadeResponse(BaseModel):
    unidade: str
    Feminino: int
    Masculino: int 