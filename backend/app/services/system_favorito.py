from app.models import modelo_resposta
from app.services import DB_postgres as DB
from app.services import TMDB_API as API
from app.utils import ConverterGenero


# Read
def buscar_favorito(id_usuario: str) -> tuple:
    """
        -> Metodo para listar id do tmdb vinculados com o usuario.

        Args:
            id_usuario (str): id do usuario para busca.
        Returns:
            tuple: retorna uma tupla, com um dicionario python formatado para o frontend e um codigo de status.
    """
    query = 'SELECT t.tmdb_id, t.tipo_midia from impacta.favoritos t WHERE t.user_id = %s ;'
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
def adicionar_favorito(dados: dict) -> tuple:
    """
        -> Metodo para vincular um id do tmdb com um usuario.

        Args:
            dados (dict): Dicionario contendo o id de usuario e o id do tmdb.
        Returns:
            tuple: retorna uma tupla, com um dicionario python formatado para o frontend e um codigo de status.
    """
    query = 'INSERT INTO impacta.favoritos (user_id, tmdb_id, tipo_midia) VALUES (%s, %s, %s);'
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], dados['tmdb_id'], dados['tipo_midia']])
        if not resp:
            return modelo_resposta(status="error", message="Registro repetido", error="Usuario não pode repetir registro", status_code=409)
        
        return modelo_resposta(message="Registro adicionado com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Delete
def deletar_favorito(dados: dict) -> tuple:
    """
        -> Metodo para remover id do tmdb vinculado com o usuario.

        Args:
            dados (dict): Dicionario com o id do usuario e o id do tmdb.
        Returns:
            tuple: retorna uma tupla, com um dicionario python formatado para o frontend e um codigo de status.
    """
    query = "DELETE FROM impacta.favoritos WHERE user_id=%s AND tmdb_id=%s;"
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], dados['tmdb_id']])
        return modelo_resposta(data=resp)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)
