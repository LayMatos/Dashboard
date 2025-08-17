from typing import List, Dict, Optional
from .base_model import BaseModel
from ..utils.string_utils import gerar_padroes_busca_cidade

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
    
    def get_policiais_por_posto_grad(self, posto_grad: Optional[str] = None) -> List[Dict]:
        query = """
        SELECT pg.posto_grad, COUNT(*)
        FROM sgpm.policial p
        JOIN sgpm.posto_grad pg ON pg.cod_posto_grad = p.cod_posto_grad
        WHERE 1=1
        """
        params = []
        if posto_grad:
            query += " AND pg.posto_grad = %s"
            params.append(posto_grad)

        query += " GROUP BY pg.posto_grad"
        results = self.execute_query(query, tuple(params))
        return [{"posto_grad": row[0], "quantidade": row[1]} for row in results] if results else []


    def get_policiais_por_unidade(self, unidade: Optional[str] = None) -> List[Dict]:
        query = """
        SELECT o.opm, COUNT(*)
        FROM sgpm.policial p
        JOIN sgpm.opm o ON o.cod_opm = p.cod_opm
        WHERE 1=1
        """
        params = []
        if unidade:
            query += " AND o.opm = %s"
            params.append(unidade)

        query += " GROUP BY o.opm"
        results = self.execute_query(query, tuple(params))
        return [{"unidade": row[0], "quantidade": row[1]} for row in results] if results else []


    def get_policiais_por_comando_regional(self, comando_regional: Optional[str] = None) -> List[Dict]:
        query = """
        SELECT gc.opm AS comando_regional, COUNT(*)
        FROM sgpm.policial p
        JOIN sgpm.opm o ON o.cod_opm = p.cod_opm
        JOIN sgpm.opm gc ON gc.cod_opm = o.subordinacao
        WHERE gc.grande_comando = 'S'
        """
        params = []
        if comando_regional:
            query += " AND gc.opm = %s"
            params.append(comando_regional)

        query += " GROUP BY gc.opm"
        results = self.execute_query(query, tuple(params))
        return [{"comando_regional": row[0], "quantidade": row[1]} for row in results] if results else []

    # Novos métodos para os filtros
    def get_postos_graduacao(self) -> List[Dict]:
        """Retorna todos os postos/graduações disponíveis."""
        query = """
        SELECT cod_posto_grad, posto_grad, posto_grad_abrev 
        FROM sgpm.posto_grad 
        WHERE cod_posto_grad > 0
        ORDER BY cod_posto_grad
        LIMIT 50;
        """
        try:
            results = self.execute_query(query)
            if not results:
                return []
            return [
                {
                    "cod_posto_grad": row[0],
                    "posto_grad": row[1],
                    "posto_grad_abrev": row[2]
                } 
                for row in results
            ]
        except Exception as e:
            print(f"Erro ao buscar postos de graduação: {str(e)}")
            return []

    def get_unidades(self) -> List[Dict]:
        """Retorna todas as unidades disponíveis."""
        query = """
        SELECT cod_opm, opm
        FROM sgpm.opm
        WHERE cod_opm > 0
        ORDER BY opm
        LIMIT 200;
        """
        try:
            results = self.execute_query(query)
            if not results:
                return []
            return [
                {
                    "cod_opm": row[0],
                    "opm": row[1]
                } 
                for row in results
            ]
        except Exception as e:
            print(f"Erro ao buscar unidades: {str(e)}")
            return []

    def get_comandos_regionais(self) -> List[Dict]:
        """Retorna todos os comandos regionais disponíveis."""
        query = """
        SELECT op.cod_opm, op.opm
        FROM sgpm.opm op
        WHERE op.grande_comando = 'S'
        ORDER BY op.cod_opm;
        """
        results = self.execute_query(query)
        if not results:
            return []
        return [
            {
                "cod_opm": row[0],
                "opm": row[1]
            } 
            for row in results
        ]

    def get_unidades_por_comando(self, comando_id: int) -> List[Dict]:
        """Retorna todas as unidades subordinadas a um comando regional específico."""
        query = """
        WITH RECURSIVE t AS (
            -- Pega o comando principal (cod_opm do comando regional)
            SELECT cod_opm, opm, subordinacao
            FROM sgpm.opm
            WHERE cod_opm = %s
            
            UNION ALL
            
            -- Vai descendo e pegando todas as unidades subordinadas
            SELECT op.cod_opm, op.opm, op.subordinacao
            FROM sgpm.opm op
            JOIN t ON op.subordinacao = t.cod_opm
        )
        SELECT DISTINCT t.cod_opm, t.opm
        FROM t
        ORDER BY t.opm;
        """
        try:
            results = self.execute_query(query, (comando_id,))
            if not results:
                return []
            return [
                {
                    "cod_opm": row[0],
                    "opm": row[1]
                } 
                for row in results
            ]
        except Exception as e:
            print(f"Erro ao buscar unidades por comando {comando_id}: {str(e)}")
            return []

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
        # Query otimizada com CTE recursiva e estrutura correta das tabelas
        if comando_regional:
            query = """
            WITH RECURSIVE unidades_cr AS (
                SELECT cod_opm, opm, subordinacao
                FROM sgpm.opm
                WHERE cod_opm = %s
                UNION ALL
                SELECT op.cod_opm, op.opm, op.subordinacao
                FROM sgpm.opm op
                JOIN unidades_cr u ON op.subordinacao = u.cod_opm
            )
            SELECT COUNT(*) 
            FROM sgpm.policial p
            JOIN sgpm.opm o ON p.cod_opm_lotacao = o.cod_opm
            LEFT JOIN sgpm.policial_situacao ps ON p.cod_policial_situacao = ps.cod_policial_situacao
            LEFT JOIN sgpm.policial_tipo pt ON p.cod_policial_tipo = pt.cod_policial_tipo
            LEFT JOIN sgpm.posto_grad pg ON p.cod_posto_grad = pg.cod_posto_grad
            WHERE 1=1
            """
            params = [comando_regional]
        else:
            query = """
            SELECT COUNT(*) 
            FROM sgpm.policial p
            JOIN sgpm.opm o ON p.cod_opm_lotacao = o.cod_opm
            LEFT JOIN sgpm.policial_situacao ps ON p.cod_policial_situacao = ps.cod_policial_situacao
            LEFT JOIN sgpm.policial_tipo pt ON p.cod_policial_tipo = pt.cod_policial_tipo
            LEFT JOIN sgpm.posto_grad pg ON p.cod_posto_grad = pg.cod_posto_grad
            WHERE 1=1
            """
            params = []

        # Aplicar filtros
        if sexo:
            query += " AND p.sexo = %s"
            params.append(sexo)

        if situacao:
            query += " AND ps.situacao = %s"
            params.append(situacao)

        if tipo:
            query += " AND pt.policial_tipo = %s"
            params.append(tipo)

        if posto_grad:
            query += " AND p.cod_posto_grad = %s"
            params.append(posto_grad)
        
        if unidade:
            query += " AND p.cod_opm_lotacao = %s"
            params.append(unidade)

        if comando_regional:
            # Filtro por comando regional usando a CTE
            query += " AND p.cod_opm_lotacao IN (SELECT cod_opm FROM unidades_cr)"

        try:
            print(f"=== DEBUG FILTRO AVANÇADO ===")
            print(f"Parâmetros recebidos: sexo={sexo}, situacao={situacao}, tipo={tipo}, comando_regional={comando_regional}, unidade={unidade}, posto_grad={posto_grad}")
            print(f"Query final: {query}")
            print(f"Parâmetros SQL: {params}")
            
            results = self.execute_query(query, tuple(params))
            quantidade = results[0][0] if results else 0
            print(f"Resultado: {quantidade} policiais encontrados")
            print(f"=== FIM DEBUG ===")
            
            return {
                "quantidade": quantidade,
                "dados": []  # Por enquanto retorna apenas a quantidade
            }
        except Exception as e:
            print(f"Erro na query de filtro avançado: {str(e)}")
            print(f"Query: {query}")
            print(f"Params: {params}")
            return {
                "quantidade": 0,
                "dados": []
            }
    

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

    def normalizar_nome_cidade(self, cidade: str) -> str:
        """Normaliza o nome da cidade para corresponder ao formato do banco de dados."""
        # Mapeamento de nomes comuns para o formato correto do banco
        mapeamento_cidades = {
            "LAMBARI DO OESTE": "LAMBARI D'OESTE",
            "GLORIA DO OESTE": "GLORIA D'OESTE", 
            "CONQUISTA DO OESTE": "CONQUISTA D'OESTE",
            "FIGUEIROPOLIS DO OESTE": "FIGUEIROPOLIS D'OESTE",
            "MIRASSOL DO OESTE": "MIRASSOL D'OESTE",
            "NOVA OLIMPIA": "NOVA OLÍMPIA",
            "CUIABA": "CUIABÁ",
            "VARZEA GRANDE": "VARZÉA GRANDE",
            "RONDONOPOLIS": "RONDONÓPOLIS",
            "SINOP": "SINOP",
            "TANGARA DA SERRA": "TANGARÁ DA SERRA",
            "BARRA DO GARCAS": "BARRA DO GARÇAS",
            "CACERES": "CÁCERES",
            "POCONE": "POCONÉ",
            "NORTELANDIA": "NORTELÂNDIA",
            "NOVA MUTUM": "NOVA MUTUM",
            "LUCAS DO RIO VERDE": "LUCAS DO RIO VERDE",
            "SORRISO": "SORRISO",
            "PRIMAVERA DO LESTE": "PRIMAVERA DO LESTE",
            "CAMPO VERDE": "CAMPO VERDE"
        }
        
        cidade_upper = cidade.upper().strip()
        
        # Verificar se existe no mapeamento
        if cidade_upper in mapeamento_cidades:
            return mapeamento_cidades[cidade_upper]
        
        # Se não estiver no mapeamento, tentar substituir "DO OESTE" por "D'OESTE"
        if "DO OESTE" in cidade_upper:
            return cidade_upper.replace("DO OESTE", "D'OESTE")
        
        return cidade_upper

    def get_dados_por_cidade(self, cidade: str) -> Dict:
        """Retorna os dados de policiais por sexo para uma cidade específica."""
        print(f"Buscando dados para cidade original: {cidade}")
        
        # Gerar padrões de busca usando a nova função
        padroes_busca = gerar_padroes_busca_cidade(cidade)
        print(f"Padrões de busca gerados: {padroes_busca}")
        
        # Tentar cada padrão até encontrar resultados
        todos_resultados = []
        
        for padrao in padroes_busca:
            print(f"Tentando padrão: {padrao}")
            
            query = """
            SELECT
                c.nome_cidade AS nome_cidade,
                SUM(CASE WHEN p.sexo = 'M' THEN 1 ELSE 0 END) AS qtd_sexoM,
                SUM(CASE WHEN p.sexo = 'F' THEN 1 ELSE 0 END) AS qtd_sexoF
            FROM sgpm.cidade c
            LEFT JOIN sgpm.opm o ON c.cod_cidade = o.cod_cidade
            LEFT JOIN sgpm.policial p ON o.cod_opm = p.cod_opm_destino AND p.cod_policial_tipo = 1
            WHERE UPPER(c.nome_cidade) ILIKE %s
            GROUP BY c.nome_cidade;
            """
            
            results = self.execute_query(query, (padrao,))
            print(f"Resultados para padrão '{padrao}': {results}")
            
            if results:
                for row in results:
                    resultado = {
                        "nome_cidade": row[0],
                        "qtd_sexoM": row[1] or 0,
                        "qtd_sexoF": row[2] or 0,
                        "total": (row[1] or 0) + (row[2] or 0)
                    }
                    todos_resultados.append(resultado)
        
        # Se encontrou resultados, retorna o que tem mais policiais
        if todos_resultados:
            # Ordena por total de policiais (decrescente) e depois por nome da cidade
            todos_resultados.sort(key=lambda x: (x['total'], x['nome_cidade']), reverse=True)
            melhor_resultado = todos_resultados[0]
            print(f"Melhor resultado encontrado: {melhor_resultado}")
            return {
                "nome_cidade": melhor_resultado["nome_cidade"],
                "qtd_sexoM": melhor_resultado["qtd_sexoM"],
                "qtd_sexoF": melhor_resultado["qtd_sexoF"]
            }
        
        # Se nenhum padrão funcionou, retornar dados zerados
        print(f"Nenhum resultado encontrado para nenhum padrão, retornando dados zerados")
        return {
            "nome_cidade": cidade,
            "qtd_sexoM": 0,
            "qtd_sexoF": 0
        }

    def filtrar_policiais(
            self,
            sexo: str = None,
            situacao: str = None,
            tipo: str = None,
            posto_grad: str = None,
            unidade: str = None,
            comando_regional: str = None
    ) -> Dict:
        """Filtra policiais com base em sexo, situação, tipo, posto/graduação, unidade e comando regional."""
        query = """
        SELECT COUNT(*) 
    FROM sgpm.policial p
    JOIN sgpm.policial_tipo t ON t.cod_policial_tipo = p.cod_policial_tipo
    JOIN sgpm.policial_situacao s ON s.cod_policial_situacao = p.cod_policial_situacao
    JOIN sgpm.posto_grad pg ON pg.cod_posto_grad = p.cod_posto_grad
    JOIN sgpm.opm op ON op.cod_opm = p.cod_opm
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

        if posto_grad:
            lista = posto_grad.split(",")
            placeholders = ",".join(["%s"] * len(lista))
            query += f" AND pg.posto_grad IN ({placeholders})"
            params.extend(lista)
        
        if unidade:
            lista = unidade.split(",")
            placeholders = ",".join(["%s"] * len(lista))
            query += f" AND op.cod_opm IN ({placeholders})"
            params.extend(lista)

        if comando_regional:
            lista = comando_regional.split(",")
            placeholders = ",".join(["%s"] * len(lista))
            query += f"""
            AND (
                op.cod_opm IN (
                    WITH RECURSIVE t AS (
                        SELECT cod_opm, subordinacao
                        FROM sgpm.opm
                        WHERE cod_opm IN ({placeholders})
                        UNION
                        SELECT o.cod_opm, o.subordinacao
                        FROM sgpm.opm o
                        JOIN t ON o.subordinacao = t.cod_opm
                    )
                    SELECT cod_opm FROM t
                )
            )
            """
            params.extend(lista)

        results = self.execute_query(query, tuple(params))
        return {"quantidade": results[0][0] if results else 0}

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