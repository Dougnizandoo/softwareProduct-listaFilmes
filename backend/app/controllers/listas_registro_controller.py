from app.models import modelo_resposta
from app.services import DB_postgres as DB
from app.services import TMDB_API as API
from app.utils import ConverterGenero
from app.utils import query_create, query_read, query_delete

# Ler
def buscar_lista_registro(table_id: str, user_id: str | None):
    """
        Busca todos os registros associados a uma lista, incluindo o nome da lista e se ela pertence ao usuário autenticado.

        Args:
            - table_id (str): ID da lista personalizada.
            - user_id (str, optional): ID do usuário.
        Returns:
            dict: Resposta padronizada contendo o nome da lista, se é do usuário, e os registros da mesma, ou mensagem de erro.

    """
    query = 'SELECT u.user_id, u.table_nome, r.tmdb_id, r.tipo_midia FROM impacta.listas_usuario AS u LEFT JOIN impacta.listas_registro AS r ON u.table_id = r.table_id WHERE u.table_id = %s;'
    busca_banco = DB().buscar_banco(query, [table_id])
    if len(busca_banco) == 0:
        return modelo_resposta(message='ID de lista não registrado no banco de dados.', error='table_id invalido!', status=401)

    nome_lista = busca_banco[0][1]
    dono_lista = busca_banco[0][0]
    resp = {'table_nome': nome_lista,
            'lista_usuario': user_id == dono_lista if isinstance(user_id, str) else False
            }

    lista_registro = []
    for _, _, tmdb_id, tipo_midia in busca_banco:
        if tmdb_id != None and tipo_midia != None:
            midia = API().buscar_por_id(tipo_midia, tmdb_id)
            midia_convertida = ConverterGenero(midia, True)
            lista_registro.append(midia_convertida)
    resp['lista_registro'] = lista_registro
    return modelo_resposta(data=resp)


# Adicionar
def adicionar_lista_registro(dados: dict):
    """
        Adiciona uma nova midia á uma lista personalizada.

        Args:
            dados (dict): Dicionário deve conter os campos:
                - table_id (str): ID da lista.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
                - tipo_midia (int): Tipo da mídia (0 = Filme, 1 = Série).
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_create('listas_registro', ['table_id', 'tmdb_id', 'tipo_midia'])
    try:
        resp = DB().modificar_banco(query, [ dados['table_id'], dados['tmdb_id'], dados['tipo_midia'] ])
        if not resp:
            return modelo_resposta(status="error", message="Erro de registro", error="A lista já possui essa midia ou table_id é invalido!", status_code=409)
        
        return modelo_resposta(message="Midia adicionada com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Remover
def deletar_lista_registro(dados: dict):
    """
        Remove uma mídia de uma lista personalizada.

        Args:
            dados (dict): Dicionário deve conter os campos:
                - table_id (str): ID da lista desejada.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_delete('listas_registro', ['table_id', 'tmdb_id'])
    try:
        resp = DB().modificar_banco(query, [dados['table_id'], dados['tmdb_id']])
        return modelo_resposta(data=resp, message="Midia removida da lista com sucesso!")
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar remover dado ao banco", error=err, status_code=500)

