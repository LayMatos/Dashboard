import psycopg2
from typing import Optional

class DatabaseConfig:
    def __init__(self):
        self.host = "172.16.74.235"
        self.database = "PMMT"
        self.user = "user_dashboard"
        self.password = "69-boa#bd#5e"

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