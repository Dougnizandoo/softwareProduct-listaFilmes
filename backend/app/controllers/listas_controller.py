from app.models import modelo_resposta
from app.services import DB_postgres as DB
from uuid import uuid4
from app.utils import query_create, query_read, query_delete


# Ler
def buscar_lista(id_usuario: str):
    """
        Busca todas as listas personalizadas associadas a um usuário.

        Args:
            id_usuario (str): ID do usuario no sistema.
        Returns:
            dict: Resposta padronizada contendo o nome e ID das listas do usuário ou mensagem de erro.
    """
    query = query_read('listas_usuario', ['user_id'], ['table_id', 'table_nome'])
    dados = DB().buscar_banco(query, [id_usuario])
    if len(dados) == 0:
        return modelo_resposta(message='Nenhuma Lista encontrada', error='Nenhuma lista vinculada ao id de usuario foi encontrada')

    resp = []
    for lista in dados:
        resp.append({
            'table_id': lista[0],
            'table_nome': lista[1]
        })
    return modelo_resposta(data=resp)


# Adicionar
def adicionar_lista(dados: dict):
    """
        Adiciona uma nova lista personalizada para um usuário, incluindo seus registros associados.

        Args:
            dados (dict): Dicionário deve conter os campos:
                - user_id (str): ID do usuário.
                - table_nome (str): Nome da nova lista.
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_create('listas_usuario', ['user_id', 'table_id', 'table_nome'])
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], str(uuid4()), dados['table_nome']])
        if not resp:
            return modelo_resposta(status="error", message="Registro repetido", error="O usuario já possui uma lista com o mesmo nome!", status_code=409)
        
        return modelo_resposta(message="Lista criada com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Remover
def deletar_lista(dados: dict):
    """
        Deleta uma lista personalizada de um usuario.

        Args:
            dados (dict): Dicionário deve conter os campos:
                - user_id (str): ID do usuário.
                - table_id (str): ID da lista de um usuario.
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_delete('listas_usuario', ['user_id', 'table_id'])
    try:
        DB().modificar_banco(query_delete('listas_registro', ['table_id']), [dados['table_id']])
        resp = DB().modificar_banco(query, [dados['user_id'], dados['table_id']])
        return modelo_resposta(data=resp, message="Lista deletada com sucesso!")
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar remover dado ao banco", error=err, status_code=500)

