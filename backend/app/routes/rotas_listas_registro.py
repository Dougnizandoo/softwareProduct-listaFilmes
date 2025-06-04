from flask import Blueprint, request
from app.controllers import adicionar_lista_registro, deletar_lista_registro, buscar_lista_registro
from app.models import modelo_resposta
from app.utils import ValidarJSON


# Blueprint para rotas relacionadas a novos registros a tabelas personalizadas dos usuários.
regApp = Blueprint("regApp", __name__)

# Buscar
@regApp.route("/Listas/Registro/Read/<table_id>/<user_id>", methods=['GET'])
@regApp.route("/Listas/Registro/Read/<table_id>", defaults={'user_id': None}, methods=['GET'])
def listas_registro_get(table_id: str, user_id=None):
    """
        Retorna os registros de uma lista personalizada.

        Args:
            table_id (str): ID da lista a ser pesquisada.
            user_id (str, optional): ID do usuário que fez a requisição (usado para verificar a propriedade da lista).
        Returns:
            JSON: Dicionário contendo os registros da lista, o nome da lista e um booleano indicando se o usuário é o proprietário.
    """
    resp = buscar_lista_registro(table_id, user_id)
    return resp

# Adicionar
@regApp.route("/Listas/Registro/Create", methods=['POST'])
def listas_registro_setter():
    """
        Adiciona uma mídia a uma lista personalizada de um usuário.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera-se um JSON no corpo da requisição com os campos:
                - table_id (str): ID da lista desejada.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
                - tipo_midia (int): Tipo da mídia (0 = Filme, 1 = Série).
        Returns:
            JSON: Resposta padronizada indicando sucesso ou erro.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'table_id', 'tmdb_id', 'tipo_midia'})
    if not isinstance(valido, bool): 
        return valido

    return adicionar_lista_registro(dados)


# Remover
@regApp.route("/Listas/Registro/Delete", methods=["DELETE"])
def listas_registro_delete():
    """
        Remove uma mídia de uma lista personalizada de um usuário.

        Args:
            - table_id (str): ID da lista de um usuario.
            - tmdb_id (str): ID da mídia (referente ao TMDB).
        Returns:
            JSON: Resposta padronizada indicando sucesso ou erro.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={"table_id", "tmdb_id"})
    if not isinstance(valido, bool): 
        return valido

    return deletar_lista_registro(dados)
