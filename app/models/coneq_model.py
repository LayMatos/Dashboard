from typing import List, Dict, Optional
from .base_model import BaseModel

class ConeqModel(BaseModel):
    def get_estoque_quantidade(self) -> List[Dict]:
        query = """
        SELECT 
            te.nome AS equipamento_nome, 
            COUNT(e.id) AS quantidade_em_estoque
        FROM 
            coneq.equipamento e
        JOIN 
            coneq.tipo_equipamento te ON e.tipo_equipamento_id = te.id
        WHERE 
            e.status ILIKE 'em estoque'
        GROUP BY 
            te.nome
        ORDER BY 
            te.nome;
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [{"equipamento_nome": row[0], "quantidade_em_estoque": row[1]} for row in results]

    def get_estoque_geral(self) -> Dict:
        query = """
        SELECT 
            e.status AS status_estoque,
            COUNT(e.id) AS quantidade_estoque,
            (SELECT COUNT(tc.cod_cautela) FROM coneq.termo_cautela tc) AS qtd_cautelas,
            (SELECT COUNT(td.cod_descautela) FROM coneq.termo_descautela td) AS qtd_descautelas,
            ((SELECT COUNT(tc.cod_cautela) FROM coneq.termo_cautela tc) - 
             (SELECT COUNT(td.cod_descautela) FROM coneq.termo_descautela td)) AS cautela_real
        FROM 
            coneq.equipamento e
        WHERE 
            e.status IN ('EM ESTOQUE', 'SEPARADO PARA ENTREGA', 'ENTREGUE')
        GROUP BY 
            e.status;
        """
        results = self.execute_query(query)
        if not results:
            return {"estoque": [], "cautelas": 0}
        
        estoque = [{"status": row[0], "quantidade": row[1]} for row in results]
        cautela_real = results[0][4] if results else 0
        
        return {"estoque": estoque, "cautelas": cautela_real}

    def get_estoque_por_tipo(self, tipo_equipamento_id: int) -> Dict:
        query = """
        SELECT 
            e.status AS status_estoque,
            COUNT(e.id) AS quantidade_estoque,
            (SELECT COUNT(tc.cod_cautela) FROM coneq.termo_cautela tc) AS qtd_cautelas,
            (SELECT COUNT(td.cod_descautela) FROM coneq.termo_descautela td) AS qtd_descautelas,
            ((SELECT COUNT(tc.cod_cautela) FROM coneq.termo_cautela tc) - 
             (SELECT COUNT(td.cod_descautela) FROM coneq.termo_descautela td)) AS cautela_real
        FROM 
            coneq.equipamento e
        WHERE 
            e.tipo_equipamento_id = %s AND
            e.status IN ('EM ESTOQUE', 'SEPARADO PARA ENTREGA', 'ENTREGUE')
        GROUP BY 
            e.status;
        """
        results = self.execute_query(query, (tipo_equipamento_id,))
        if not results:
            return {"estoque": [], "cautelas": 0}
        
        estoque = [{"status": row[0], "quantidade": row[1]} for row in results]
        cautela_real = results[0][4] if results else 0
        
        return {"estoque": estoque, "cautelas": cautela_real}

    def get_cautela_por_tipo(self, tipo_equipamento_id: int, status: str = "todos") -> Dict:
        if status == "todos":
            # Se tipo_equipamento_id for 0, busca todos os tipos
            tipo_condition = "" if tipo_equipamento_id == 0 else "AND te.id = %s"
            params = (tipo_equipamento_id,) if tipo_equipamento_id != 0 else ()
            
            query = f"""
            SELECT
                COUNT(CASE WHEN tc.status_id = 6 THEN 1 END) AS status_6,
                COUNT(CASE WHEN tc.status_id = 7 THEN 1 END) AS status_7,
                COUNT(CASE WHEN tc.status_id = 8 THEN 1 END) AS status_8,
                COUNT(CASE WHEN tc.status_id = 9 THEN 1 END) AS status_9
            FROM
                coneq.tipo_equipamento te
            INNER JOIN
                coneq.equipamento e ON e.tipo_equipamento_id = te.id
            INNER JOIN
                coneq.termo_cautela tc ON tc.cod_cautela = e.termo_cautela_cod_cautela
            WHERE
                tc.status_id IN (6, 7, 8, 9)
                {tipo_condition}
            """
            results = self.execute_query(query, params)
            if not results:
                return {"cautela": []}

            status_6, status_7, status_8, status_9 = results[0] if results else (0, 0, 0, 0)
            return {
                "cautela": [
                    {"status": "6", "quantidade": status_6},
                    {"status": "7", "quantidade": status_7},
                    {"status": "8", "quantidade": status_8},
                    {"status": "9", "quantidade": status_9}
                ]
            }
        else:
            query = """
            SELECT
                COUNT(CASE WHEN tc.status_id = %s THEN 1 END) AS status
            FROM
                coneq.tipo_equipamento te
            INNER JOIN
                coneq.equipamento e ON e.tipo_equipamento_id = te.id
            INNER JOIN
                coneq.termo_cautela tc ON tc.cod_cautela = e.termo_cautela_cod_cautela
            WHERE
                te.id = %s
                AND tc.status_id = %s;
            """
            results = self.execute_query(query, (status, tipo_equipamento_id, status))
            if not results:
                return {"cautela": []}

            return {
                "cautela": [
                    {"status": status, "quantidade": results[0][0] if results else 0}
                ]
            }

    def get_tipos_equipamento(self) -> List[Dict]:
        query = """
        SELECT id, nome
        FROM coneq.tipo_equipamento;
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [{"id": row[0], "nome": row[1]} for row in results]

    def get_cautelas_por_cidade(self, cidades: List[str]) -> List[Dict]:
        try:
            cidades_upper = [cidade.upper() for cidade in cidades]
            cidade_filtro = ",".join([f"'{cidade}'" for cidade in cidades_upper])
            
            query = f"""
                SELECT 
                    UPPER(c.cidade) AS nome_cidade, 
                    COUNT(DISTINCT e.id) AS qtd_cautelas
                FROM coneq.equipamento e
                JOIN coneq.termo_cautela tc ON tc.cod_cautela = e.termo_cautela_cod_cautela
                JOIN geral.tb_policial p ON p.cod_policial = tc.recebedor
                JOIN geral.tb_upm up ON up.cod_upm = p.cod_upm
                JOIN geral.tb_cidade c ON c.cod_cidade = up.cod_cidade
                WHERE UPPER(c.cidade) IN ({cidade_filtro})
                AND tc.status_id IN (6, 7)  -- Apenas cautelas ativas (Aguardando Assinatura e Assinado)
                GROUP BY UPPER(c.cidade)
            """
            
            print(f"Executando query de cautelas: {query}")  # Debug
            results = self.execute_query(query)
            print(f"Resultados da consulta de cautelas: {results}")  # Debug
            
            if not results:
                print(f"Nenhum resultado encontrado para as cidades: {cidades_upper}")
                return [{"nome_cidade": cidade, "qtd_cautelas": 0} for cidade in cidades]

            resultados_dict = {row[0]: row[1] for row in results}
            print(f"Dicionário de resultados de cautelas: {resultados_dict}")  # Debug
            
            retorno = []
            for cidade in cidades:
                cidade_upper = cidade.upper()
                qtd = resultados_dict.get(cidade_upper, 0)
                retorno.append({
                    "nome_cidade": cidade,
                    "qtd_cautelas": qtd
                })
            print(f"Retorno final de cautelas: {retorno}")  # Debug
            return retorno
            
        except Exception as e:
            print(f"Erro na consulta de cautelas por cidade: {str(e)}")
            return [{"nome_cidade": cidade, "qtd_cautelas": 0} for cidade in cidades]

    def get_entregas_por_cidade(self, cidades: List[str]) -> List[Dict]:
        try:
            cidades_upper = [cidade.upper() for cidade in cidades]
            cidade_filtro = ",".join([f"'{cidade}'" for cidade in cidades_upper])
            
            query = f"""
                SELECT 
                    UPPER(c.cidade) AS nome_cidade, 
                    COUNT(DISTINCT e.id) AS qtd_entregas
                FROM coneq.equipamento e
                JOIN coneq.termo_cautela tc ON tc.cod_cautela = e.termo_cautela_cod_cautela
                JOIN geral.tb_policial p ON p.cod_policial = tc.recebedor
                JOIN geral.tb_upm up ON up.cod_upm = p.cod_upm
                JOIN geral.tb_cidade c ON c.cod_cidade = up.cod_cidade
                WHERE UPPER(c.cidade) IN ({cidade_filtro})
                AND e.status = 'ENTREGUE'
                AND tc.status_id IN (6, 7)  -- Apenas cautelas ativas (Aguardando Assinatura e Assinado)
                GROUP BY UPPER(c.cidade)
            """
            
            print(f"Executando query de entregas: {query}")  # Debug
            results = self.execute_query(query)
            print(f"Resultados da consulta de entregas: {results}")  # Debug
            
            if not results:
                print(f"Nenhum resultado encontrado para as cidades: {cidades_upper}")
                return [{"nome_cidade": cidade, "qtd_entregas": 0} for cidade in cidades]

            resultados_dict = {row[0]: row[1] for row in results}
            print(f"Dicionário de resultados de entregas: {resultados_dict}")  # Debug
            
            retorno = []
            for cidade in cidades:
                cidade_upper = cidade.upper()
                qtd = resultados_dict.get(cidade_upper, 0)
                retorno.append({
                    "nome_cidade": cidade,
                    "qtd_entregas": qtd
                })
            print(f"Retorno final de entregas: {retorno}")  # Debug
            return retorno
            
        except Exception as e:
            print(f"Erro na consulta de entregas por cidade: {str(e)}")
            return [{"nome_cidade": cidade, "qtd_entregas": 0} for cidade in cidades] 