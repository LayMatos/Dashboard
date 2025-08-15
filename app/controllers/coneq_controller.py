from typing import List, Dict
from fastapi import HTTPException
from app.models.coneq_model import ConeqModel
from app.utils.string_utils import remover_caracteres_especiais

class ConeqController:
    def __init__(self):
        self.model = ConeqModel()

    def get_estoque(self) -> List[Dict]:
        """Retorna os dados de estoque."""
        dados = self.model.get_estoque_quantidade()
        if not dados:
            raise HTTPException(status_code=500, detail="Erro ao buscar os dados do estoque")
        return dados

    def get_estoque_geral(self) -> Dict:
        """Retorna os dados gerais de estoque."""
        dados = self.model.get_estoque_geral()
        if not dados["estoque"]:
            raise HTTPException(status_code=404, detail="Nenhum dado encontrado no estoque")
        return dados

    def get_estoque_por_tipo(self, tipo_equipamento_id: int) -> Dict:
        """Retorna os dados de estoque por tipo de equipamento."""
        dados = self.model.get_estoque_por_tipo(tipo_equipamento_id)
        if not dados["estoque"]:
            raise HTTPException(status_code=404, detail="Nenhum dado encontrado para o tipo de equipamento especificado")
        return dados

    def get_cautela_por_tipo(self, tipo_equipamento_id: int, status: str = "todos") -> Dict:
        """Retorna os dados de cautela por tipo de equipamento."""
        dados = self.model.get_cautela_por_tipo(tipo_equipamento_id, status)
        if not dados["cautela"]:
            raise HTTPException(status_code=404, detail="Nenhum dado de cautela encontrado")
        return dados

    def get_estoque_status(self) -> Dict:
        """Retorna os dados de estoque com status."""
        return self.model.get_estoque_status()

    def get_tipos_equipamento(self) -> List[Dict]:
        """Retorna os tipos de equipamento."""
        tipos = self.model.get_tipos_equipamento()
        if not tipos:
            raise HTTPException(status_code=500, detail="Erro ao buscar os tipos de equipamentos")
        return tipos

    def get_cautelas_por_cidade(self, cidades: str) -> List[Dict]:
        """Retorna as cautelas por cidade."""
        try:
            # Processando a string de cidades
            cidades_lista = [cidade.strip() for cidade in cidades.split(",")]
            cidades_processadas = [remover_caracteres_especiais(cidade) for cidade in cidades_lista]
            
            dados = self.model.get_cautelas_por_cidade(cidades_processadas)
            if not dados:
                raise HTTPException(
                    status_code=404,
                    detail="Nenhuma cautela encontrada para as cidades selecionadas"
                )
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados de cautelas: {str(e)}"
            )

    def get_entregas_por_cidade(self, cidades: str) -> List[Dict]:
        """Retorna as entregas por cidade."""
        try:
            # Processando a string de cidades
            cidades_lista = [cidade.strip() for cidade in cidades.split(",")]
            cidades_processadas = [remover_caracteres_especiais(cidade) for cidade in cidades_lista]
            
            dados = self.model.get_entregas_por_cidade(cidades_processadas)
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados de entregas: {str(e)}"
            ) 