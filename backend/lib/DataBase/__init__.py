from psycopg2 import connect, DatabaseError


class DB:
    def __init__(self):
        self.__database = {
            'dbname': 'pandora',
            'user': 'dougnizando',
            'password': '2123',
            'host': 'localhost',
            'port': 5432
        }

    def conectar(self):
        try:
            con = connect(**self.__database)
            cursor = con.cursor()
            return con, cursor
        except DatabaseError as err:
            print(f'Erro ao se conectar ao banco: {err}')
            return None, None

    @staticmethod
    def finalizar_conexao(con, cursor):
        cursor.close()
        con.close()

    def modificar_banco(self, query: str, param: list) -> bool:
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
        try:
            con, cursor = self.conectar()
            cursor.execute(query, param)
            resp = cursor.fetchall()
            self.finalizar_conexao(con, cursor)
            return resp
        except DatabaseError as err:
            print(f'Erro ao consultar dados: {err}')
            return []
