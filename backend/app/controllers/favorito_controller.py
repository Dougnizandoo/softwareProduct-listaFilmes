from app.models import modelo_resposta
from app.services import DB_postgres as DB
from app.services import TMDB_API as API
from app.utils import ConverterGenero
from app.utils import query_create, query_read, query_delete


# Read
def buscar_favorito(id_usuario: str) -> dict:
    """
        Busca todos os favoritos associados a um usuário.

        Args:
            id_usuario (str): ID do usuario no sistema.
        Returns:
            dict: Resposta padronizada contendo a lista de mídias favoritas ou mensagem de erro.
    """
    query = query_read('favoritos', ['user_id'], ['tmdb_id', 'tipo_midia'])
    dados = DB().buscar_banco(query, [id_usuario])
    if len(dados) == 0:
        return modelo_resposta(message='Lista vazia', error='Nenhum dado foi encontrado!')

    resp = []
    for valor in dados:
        midia = API().buscar_por_id(valor[1], valor[0])
        midia = ConverterGenero(midia, True)
        resp.append(midia)

    return modelo_resposta(data=resp)

# Create
def adicionar_favorito(dados: dict) -> dict:
    """
        Adiciona uma nova midia à lista de favoritos do usuário.

        Args:
            dados (dict): Dicionário deve conter os campos: 
                - user_id (str): ID do usuário.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
                - tipo_midia (int): Tipo da mídia (0 = Filme, 1 = Série).
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_create('favoritos', ['user_id', 'tmdb_id', 'tipo_midia'])
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], dados['tmdb_id'], dados['tipo_midia']])
        if not resp:
            return modelo_resposta(status="error", message="Registro repetido", error="Usuario não pode repetir registro", status_code=409)
        
        return modelo_resposta(message="Registro adicionado com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Delete
def deletar_favorito(dados: dict) -> dict:
    """
        Remove uma mida da lista de favoritos do usuário.

        Args:
            dados (dict): Dicionário deve conter os campos: 
                - user_id (str): ID do usuário.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
        Returns:
            dict: Resposta padronizada indicando sucesso ou erro.
    """
    query = query_delete('favoritos', ['user_id', 'tmdb_id'])
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], dados['tmdb_id']])
        return modelo_resposta(data=resp)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)
