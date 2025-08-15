from typing import List, Dict, Optional
from .base_model import BaseModel

class SgpmModel(BaseModel):
    def get_policiais_por_sexo(self) -> List[Dict]:
        query = """
        SELECT p.sexo, COUNT(*) 
        FROM sgpm.policial p
        WHERE p.cod_policial_tipo = 1
        GROUP BY p.sexo;
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [{"sexo": row[0], "quantidade": row[1]} for row in results]

    def get_policiais_por_tipo(self) -> List[Dict]:
        query = """
        SELECT t.policial_tipo, count(*) 
        FROM sgpm.policial p
        JOIN sgpm.policial_tipo t on t.cod_policial_tipo = p.cod_policial_tipo
        GROUP BY t.policial_tipo
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [{"tipo": row[0], "quantidade": row[1]} for row in results]

    def get_policiais_por_situacao(self) -> List[Dict]:
        query = """
        SELECT t.situacao, count(*) 
        FROM sgpm.policial p
        JOIN sgpm.policial_situacao t on t.cod_policial_situacao = p.cod_policial_situacao
        GROUP BY t.situacao
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [{"situacao": row[0], "quantidade": row[1]} for row in results]

    def get_policiais_por_posto_grad_sexo(self, sexo: str = None, situacao: str = None, tipo: str = None) -> Dict:
        """Retorna os dados de policiais por posto/graduação e sexo, incluindo totais."""
        query = """
        WITH dados_posto_grad AS (
            SELECT 
                pg.posto_grad,
                p.sexo,
                COUNT(*) as quantidade,
                pg.ordem
            FROM sgpm.policial p
            JOIN sgpm.posto_grad pg ON pg.cod_posto_grad = p.cod_posto_grad
            JOIN sgpm.policial_situacao ps ON ps.cod_policial_situacao = p.cod_policial_situacao
            JOIN sgpm.policial_tipo pt ON pt.cod_policial_tipo = p.cod_policial_tipo
            WHERE 1=1
        """
        params = []

        if sexo:
            sexo_lista = sexo.split(",")
            placeholders = ",".join(["%s"] * len(sexo_lista))
            query += f" AND p.sexo IN ({placeholders})"
            params.extend(sexo_lista)

        if situacao:
            situacao_lista = situacao.split(",")
            placeholders = ",".join(["%s"] * len(situacao_lista))
            query += f" AND ps.situacao IN ({placeholders})"
            params.extend(situacao_lista)

        if tipo:
            tipo_lista = tipo.split(",")
            placeholders = ",".join(["%s"] * len(tipo_lista))
            query += f" AND pt.policial_tipo IN ({placeholders})"
            params.extend(tipo_lista)

        query += """
            GROUP BY pg.posto_grad, p.sexo, pg.ordem
        )
        SELECT 
            posto_grad,
            SUM(CASE WHEN sexo = 'F' THEN quantidade ELSE 0 END) as feminino,
            SUM(CASE WHEN sexo = 'M' THEN quantidade ELSE 0 END) as masculino,
            SUM(quantidade) as total,
            ordem
        FROM dados_posto_grad
        GROUP BY posto_grad, ordem
        ORDER BY ordem;
        """
        
        results = self.execute_query(query, tuple(params))
        if not results:
            return {"feminino": [], "masculino": []}

        # Organizar os dados para o formato esperado pelo frontend
        dados_formatados = {
            "feminino": [],
            "masculino": []
        }

        for posto_grad, feminino, masculino, total, ordem in results:
            dados_formatados["feminino"].append({
                "posto_grad": posto_grad,
                "quantidade": feminino
            })
            dados_formatados["masculino"].append({
                "posto_grad": posto_grad,
                "quantidade": masculino
            })

        return dados_formatados

    def get_policiais_por_cr(self) -> Dict[str, int]:
        query = """
        SELECT  
            op.opm AS cr, 
            SUM(1) AS total
        FROM sgpm.policial p
        INNER JOIN sgpm.opm op ON op.cod_opm = p.cod_opm_lotacao
        WHERE op.grande_comando = 'S'
        GROUP BY op.opm
        ORDER BY op.opm;
        """
        results = self.execute_query(query)
        if not results:
            return {}
        return {row[0]: row[1] for row in results}

    def get_policiais_por_unidade(self, cidade: str) -> List[Dict]:
        """Retorna a contagem de policiais por sexo e unidade em uma cidade específica."""
        print(f"Buscando dados por unidade para cidade: {cidade}")
        
        # Primeiro, vamos verificar se a cidade existe
        query_cidade = """
        SELECT nome_cidade FROM sgpm.cidade WHERE UPPER(nome_cidade) = %s
        """
        cidade_existe = self.execute_query(query_cidade, (cidade.upper(),))
        print(f"Cidade existe na tabela: {cidade_existe}")
        
        # Query alternativa mais robusta - busca todas as unidades da cidade
        query = """
        SELECT  
            op.opm,
            c.nome_cidade,
            COALESCE(SUM(CASE WHEN p.sexo = 'M' THEN 1 ELSE 0 END), 0) AS masculino,
            COALESCE(SUM(CASE WHEN p.sexo = 'F' THEN 1 ELSE 0 END), 0) AS feminino
        FROM sgpm.opm op
        INNER JOIN sgpm.cidade c ON c.cod_cidade = op.cod_cidade
        LEFT JOIN sgpm.policial p ON op.cod_opm = p.cod_opm_lotacao AND p.cod_policial_tipo = 1
        WHERE UPPER(c.nome_cidade) = %s
        GROUP BY op.opm, c.nome_cidade
        ORDER BY op.opm;
        """
        
        print(f"Query SQL: {query}")
        print(f"Parâmetro cidade: {cidade.upper()}")
        
        results = self.execute_query(query, (cidade.upper(),))
        print(f"Resultados da query: {results}")
        
        if not results:
            print(f"Nenhum resultado para cidade: {cidade}")
            return []

        resultado = []
        for opm, nome_cidade, masculino, feminino in results:
            print(f"Processando unidade: opm={opm}, masculino={masculino}, feminino={feminino}")
            resultado.append({
                "unidade": opm,
                "Masculino": masculino,
                "Feminino": feminino
            })
        
        print(f"Resultado final por unidade: {resultado}")
        return resultado

    def get_dados_por_cidade(self, cidade: str) -> Dict:
        """Retorna os dados de policiais por sexo para uma cidade específica."""
        print(f"Buscando dados para cidade: {cidade}")
        
        # Primeiro, vamos verificar se a cidade existe na tabela de cidades
        query_cidade = """
        SELECT nome_cidade FROM sgpm.cidade WHERE UPPER(nome_cidade) = %s
        """
        cidade_existe = self.execute_query(query_cidade, (cidade.upper(),))
        print(f"Cidade existe na tabela: {cidade_existe}")
        
        query = """
        SELECT
            c.nome_cidade AS nome_cidade,
            SUM(CASE WHEN p.sexo = 'M' THEN 1 ELSE 0 END) AS qtd_sexoM,
            SUM(CASE WHEN p.sexo = 'F' THEN 1 ELSE 0 END) AS qtd_sexoF
        FROM sgpm.cidade c
        LEFT JOIN sgpm.opm o ON c.cod_cidade = o.cod_cidade
        LEFT JOIN sgpm.policial p ON o.cod_opm = p.cod_opm_destino AND p.cod_policial_tipo = 1
        WHERE UPPER(c.nome_cidade) = %s
        GROUP BY c.nome_cidade;
        """
        
        print(f"Query SQL: {query}")
        print(f"Parâmetro cidade: {cidade.upper()}")
        
        results = self.execute_query(query, (cidade.upper(),))
        print(f"Resultados da query: {results}")
        
        if not results:
            print(f"Nenhum resultado para {cidade}, retornando dados zerados")
            return {
                "nome_cidade": cidade,
                "qtd_sexoM": 0,
                "qtd_sexoF": 0
            }
        
        # Retorna o primeiro resultado (deve ser apenas um para uma cidade)
        row = results[0]
        resultado = {
            "nome_cidade": row[0],
            "qtd_sexoM": row[1] or 0,
            "qtd_sexoF": row[2] or 0
        }
        print(f"Resultado processado: {resultado}")
        return resultado

    def filtrar_policiais(self, sexo: str = None, situacao: str = None, tipo: str = None) -> Dict:
        """Filtra policiais com base em sexo, situação e tipo."""
        query = """
        SELECT COUNT(*) 
        FROM sgpm.policial p
        JOIN sgpm.policial_tipo t ON t.cod_policial_tipo = p.cod_policial_tipo
        JOIN sgpm.policial_situacao s ON s.cod_policial_situacao = p.cod_policial_situacao
        WHERE 1=1
        """
        params = []

        if sexo:
            sexo_lista = sexo.split(",")
            placeholders = ",".join(["%s"] * len(sexo_lista))
            query += f" AND p.sexo IN ({placeholders})"
            params.extend(sexo_lista)

        if situacao:
            situacao_lista = situacao.split(",")
            placeholders = ",".join(["%s"] * len(situacao_lista))
            query += f" AND s.situacao IN ({placeholders})"
            params.extend(situacao_lista)

        if tipo:
            tipo_lista = tipo.split(",")
            placeholders = ",".join(["%s"] * len(tipo_lista))
            query += f" AND t.policial_tipo IN ({placeholders})"
            params.extend(tipo_lista)

        results = self.execute_query(query, tuple(params))
        if not results:
            return {"quantidade": 0}

        return {"quantidade": results[0][0]}

    def get_totais_por_cr(self) -> Dict[str, int]:
        """Retorna o total de policiais por CR."""
        query = """
        SELECT  
            op.opm AS cr, 
            SUM(1) AS total
        FROM sgpm.policial p
        INNER JOIN sgpm.opm op ON op.cod_opm = p.cod_opm_lotacao
        WHERE op.grande_comando = 'S'
        GROUP BY op.opm
        ORDER BY op.opm;
        """
        results = self.execute_query(query)
        if not results:
            return {}
        return {row[0]: row[1] for row in results} 