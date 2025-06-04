from psycopg2 import connect, DatabaseError
from dotenv import load_dotenv
import os


load_dotenv()
class DB_postgres:
    """
        Classe responsável por gerenciar a conexão e execução de operações
        com um banco de dados PostgreSQL utilizando psycopg2.

        A configuração de acesso ao banco é carregada 
        automaticamente de variáveis de ambiente.
    """
    def __init__(self):
        """
            Inicializa a configuração da conexão com o banco de dados usando 
            variáveis de ambiente definidas no arquivo `.env`.
        """
        self.__database = {
            'dbname': os.getenv('DB_NAME'),
            'user': os.getenv("DB_USER"),
            'password': os.getenv("DB_PASSWORD"),
            'host': 'localhost',
            'port': 5432
        }

    def conectar(self):
        """
            Estabelece conexão com o banco de dados PostgreSQL.

            Returns:
                tuple: Uma tupla contendo a conexão e o cursor,
                        ou (None, None) em caso de erro.
        """
        try:
            con = connect(**self.__database)
            cursor = con.cursor()
            return con, cursor
        except DatabaseError as err:
            print(f'Erro ao se conectar ao banco: {err}')
            return None, None

    @staticmethod
    def finalizar_conexao(con, cursor):
        """
            Encerra a conexão com o banco de dados e fecha o cursor.

            Args:
                con: Objeto de conexão com o banco de dados.
                cursor: Cursor da conexão.
        """
        cursor.close()
        con.close()

    def modificar_banco(self, query: str, param: list) -> bool:
        """
            Executa uma query que modifica o banco de dados (INSERT, UPDATE, DELETE).

            Args:
                query (str): Query SQL parametrizada a ser executada.
                param (list): Lista de parâmetros da query.
            
            Returns:
                bool: True se a operação for bem-sucedida, False caso contrário.
        """
        try:
            con, cursor = self.conectar()
            cursor.execute(query, param)
            con.commit()
            print('O banco foi modificado com sucesso!')
            self.finalizar_conexao(con, cursor)
            return True
        except DatabaseError as err:
            print(f'Erro ao adicionar dados: {err}')
            return False

    def buscar_banco(self, query: str, param: list) -> list:
        """
            Executa uma query de busca no banco de dados (SELECT).

            Args:
                query (str): Query SQL parametrizada a ser executada.
                param (list): Lista de parâmetros da query.
            
            Returns:
                list: Lista de resultados retornados pela query.
        """
        try:
            con, cursor = self.conectar()
            cursor.execute(query, param)
            resp = cursor.fetchall()
            self.finalizar_conexao(con, cursor)
            return resp
        except DatabaseError as err:
            print(f'Erro ao consultar dados: {err}')
            return []
