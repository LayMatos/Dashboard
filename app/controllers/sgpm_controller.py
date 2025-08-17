from typing import List, Dict
from fastapi import HTTPException
from app.models.sgpm_model import SgpmModel

class SgpmController:
    def __init__(self):
        self.model = SgpmModel()

    def get_dados_gerais(self) -> Dict:
        """Retorna os dados gerais do SGPM."""
        try:
            dados = self.model.get_dados_gerais()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados gerais: {str(e)}"
            )

    def get_dados_por_periodo(self, data_inicio: str, data_fim: str) -> Dict:
        """Retorna os dados do SGPM por período."""
        try:
            dados = self.model.get_dados_por_periodo(data_inicio, data_fim)
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado para o período especificado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por período: {str(e)}"
            )

    def get_dados_por_cidade(self, cidade: str) -> Dict:
        """Retorna os dados do SGPM por cidade."""
        try:
            dados = self.model.get_dados_por_cidade(cidade)
            if not dados:
                raise HTTPException(status_code=404, detail=f"Nenhum dado encontrado para a cidade {cidade}")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por cidade: {str(e)}"
            )

    def get_policiais_por_sexo(self) -> List[Dict]:
        """Retorna a quantidade de policiais por sexo."""
        try:
            dados = self.model.get_policiais_por_sexo()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por sexo: {str(e)}"
            )
        
    def get_policiais_por_posto_grad(self, posto_grad: str = None) -> List[Dict]:
        """Retorna a quantidade de policiais por posto/graduação."""
        try:
            dados = self.model.get_policiais_por_posto_grad(posto_grad)
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao buscar dados por posto/graduação: {str(e)}")

    def get_policiais_por_unidade(self, unidade: str = None) -> List[Dict]:
        """Retorna a quantidade de policiais por unidade (OPM)."""
        try:
            dados = self.model.get_policiais_por_unidade(unidade)
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao buscar dados por unidade: {str(e)}")

    def get_policiais_por_comando_regional(self, comando_regional: str = None) -> List[Dict]:
        """Retorna a quantidade de policiais por comando regional."""
        try:
            dados = self.model.get_policiais_por_comando_regional(comando_regional)
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao buscar dados por comando regional: {str(e)}")

    def get_policiais_por_situacao(self) -> List[Dict]:
        """Retorna a quantidade de policiais por situação."""
        try:
            dados = self.model.get_policiais_por_situacao()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por situação: {str(e)}"
            )

    def get_policiais_por_tipo(self) -> List[Dict]:
        """Retorna a quantidade de policiais por tipo."""
        try:
            dados = self.model.get_policiais_por_tipo()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por tipo: {str(e)}"
            )

    def get_policiais_por_posto_grad_sexo(self, sexo: str = None, situacao: str = None, tipo: str = None) -> Dict:
        """Retorna os dados de policiais por posto/graduação e sexo, incluindo totais."""
        try:
            dados = self.model.get_policiais_por_posto_grad_sexo(sexo, situacao, tipo)
            if not dados:
                return {
                    "feminino": [],
                    "masculino": [],
                    "totais": []
                }
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por posto/graduação: {str(e)}"
            )

    def filtrar_policiais(
        self,
        sexo: str = None,
        situacao: str = None,
        tipo: str = None,
        posto_grad: str = None,
        unidade: str = None,
        comando_regional: str = None
    ) -> Dict:
        """Filtra policiais com base em qualquer combinação de filtros."""
        try:
            dados = self.model.filtrar_policiais(
                sexo=sexo,
                situacao=situacao,
                tipo=tipo,
                posto_grad=posto_grad,
                unidade=unidade,
                comando_regional=comando_regional
            )
            if not dados or dados.get("quantidade", 0) == 0:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao filtrar policiais: {str(e)}"
        )

    # Novos métodos para os filtros
    def get_postos_graduacao(self) -> List[Dict]:
        """Retorna todos os postos/graduações disponíveis."""
        try:
            dados = self.model.get_postos_graduacao()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum posto/graduação encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar postos/graduação: {str(e)}"
            )

    def get_unidades(self) -> List[Dict]:
        """Retorna todas as unidades disponíveis."""
        try:
            dados = self.model.get_unidades()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhuma unidade encontrada")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar unidades: {str(e)}"
            )

    def get_comandos_regionais(self) -> List[Dict]:
        """Retorna todos os comandos regionais disponíveis."""
        try:
            dados = self.model.get_comandos_regionais()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum comando regional encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar comandos regionais: {str(e)}"
            )

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

    def filtrar_policiais_avancado(
        self,
        sexo: str = None,
        situacao: str = None,
        tipo: str = None,
        comando_regional: int = None,
        unidade: int = None,
        posto_grad: int = None
    ) -> Dict:
        """Filtra policiais com base em todos os filtros disponíveis."""
        try:
            print(f"=== CONTROLLER - Parâmetros recebidos ===")
            print(f"sexo: {sexo} (tipo: {type(sexo)})")
            print(f"situacao: {situacao} (tipo: {type(situacao)})")
            print(f"tipo: {tipo} (tipo: {type(tipo)})")
            print(f"comando_regional: {comando_regional} (tipo: {type(comando_regional)})")
            print(f"unidade: {unidade} (tipo: {type(unidade)})")
            print(f"posto_grad: {posto_grad} (tipo: {type(posto_grad)})")
            print(f"=== FIM CONTROLLER ===")
            
            dados = self.model.filtrar_policiais_avancado(
                sexo=sexo,
                situacao=situacao,
                tipo=tipo,
                comando_regional=comando_regional,
                unidade=unidade,
                posto_grad=posto_grad
            )
            if not dados or dados.get("quantidade", 0) == 0:
                return {"quantidade": 0, "dados": []}
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao filtrar policiais: {str(e)}"
            )

    def get_totais_por_cr(self) -> Dict[str, int]:
        """Retorna o total de policiais por CR."""
        try:
            dados = self.model.get_totais_por_cr()
            if not dados:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado")
            return dados
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar totais por CR: {str(e)}"
            ) 
        

    def get_policiais_por_cidade(self, cidades: List[str]) -> List[Dict]:
        """Retorna a contagem de policiais por sexo e cidade."""
        if not cidades:
            raise HTTPException(status_code=400, detail="Lista de cidades não pode estar vazia")

        try:
            # Normaliza os nomes das cidades para maiúsculas
            cidades_maiusculas = [cidade.upper() for cidade in cidades]
            print(f"Cidades recebidas no controller: {cidades_maiusculas}")

            resultado = []
            for cidade in cidades_maiusculas:
                print(f"Processando cidade: {cidade}")
                dados = self.model.get_dados_por_cidade(cidade)
                print(f"Dados retornados para {cidade}: {dados}")
                if dados:
                    resultado.append(dados)
                else:
                    print(f"Nenhum dado encontrado para {cidade}")

            print(f"Resultado final: {resultado}")
            if not resultado:
                raise HTTPException(status_code=404, detail="Nenhum dado encontrado para as cidades informadas")

            return resultado

        except Exception as e:
            print(f"Erro no controller: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por cidades: {str(e)}"
            )

    def get_policiais_por_unidade(self, cidade: str) -> List[Dict]:
        """Retorna a contagem de policiais por sexo e unidade em uma cidade específica."""
        if not cidade:
            raise HTTPException(status_code=400, detail="Nome da cidade não pode estar vazio")

        try:
            print(f"Buscando dados por unidade para cidade: {cidade}")
            dados = self.model.get_policiais_por_unidade(cidade)
            print(f"Dados por unidade retornados: {dados}")
            
            if not dados:
                print(f"Nenhum dado encontrado para cidade: {cidade}")
                return []
            
            return dados

        except Exception as e:
            print(f"Erro ao buscar dados por unidade: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar dados por unidade: {str(e)}"
            )
