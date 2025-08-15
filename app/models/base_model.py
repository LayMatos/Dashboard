from typing import Optional, Any
from psycopg2.extensions import connection
from app.config.database import DatabaseConfig

class BaseModel:
    def __init__(self):
        self.db_config = DatabaseConfig()

    def execute_query(self, query: str, params: tuple = None) -> Optional[list]:
        """Executa uma query e retorna os resultados."""
        conn = None
        try:
            conn = self.db_config.get_connection()
            if not conn:
                return None

            with conn.cursor() as cursor:
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                
                return cursor.fetchall()

        except Exception as e:
            print(f"Erro ao executar query: {e}")
            return None
        finally:
            if conn:
                conn.close()

    def execute_query_single(self, query: str, params: tuple = None) -> Optional[Any]:
        """Executa uma query e retorna um único resultado."""
        results = self.execute_query(query, params)
        return results[0] if results else None 