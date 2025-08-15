import psycopg2
from typing import Optional

class DatabaseConfig:
    def __init__(self):
        self.host = "172.16.74.224"
        self.database = "PMMT"
        self.user = "postgres"
        self.password = "m4stervi4@2009"

    def get_connection(self) -> Optional[psycopg2.extensions.connection]:
        """Cria e retorna uma conexão com o banco PostgreSQL."""
        try:
            connection = psycopg2.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password
            )
            print("Conexão com o banco de dados realizada com sucesso!")
            return connection
        except psycopg2.OperationalError as error:
            print(f"Erro ao conectar-se ao PostgreSQL: {error}")
            return None 