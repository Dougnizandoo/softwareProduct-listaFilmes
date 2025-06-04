from flask import Blueprint, request
from app.controllers import adicionar_favorito, buscar_favorito, deletar_favorito
from app.models import modelo_resposta
from app.utils import str_para_int as converter, ValidarJSON


# Blueprint para rotas relacionadas a lista de favoritos.
favApp = Blueprint("favApp", __name__)

# Buscar
@favApp.route("/Favorito/Read/<user_id>", methods=['GET'])
def favoritos_get(user_id: str):
    """
        Retorna a lista de favoritos de um usuário específico.

        Args:
            user_id (str): ID do usuário para o qual se deseja recuperar os favoritos.
        Returns:
            JSON: Lista de mídias favoritas ou mensagem de erro se o usuário não for encontrado.
    """
    resp = buscar_favorito(user_id)
    return resp

# Adicionar
@favApp.route("/Favorito/Create", methods=['POST'])
def favoritos_setter():
    """
        Adiciona uma nova mídia à lista de favoritos de um usuário.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera-se um JSON no corpo da requisição com os campos:
                - user_id (str): ID do usuário.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
                - tipo_midia (int): 0 para filmes; 1 para series.
        Returns:
            JSON: Resposta de sucesso ou erro dependendo da validação ou resultado da operação.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'user_id', 'tmdb_id', 'tipo_midia'})
    if not isinstance(valido, bool): 
        return valido

    return adicionar_favorito(dados)


# Remover
@favApp.route("/Favorito/Delete", methods=["DELETE"])
def favoritos_delete():
    """
        Remove uma mídia da lista de favoritos de um usuário.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera receber um arquivo JSON com as seguintes chaves:
                - user_id (str): ID do usuário.
                - tmdb_id (str): ID da mídia (referente ao TMDB).
        Returns:
            JSON: Resposta indicando sucesso ou erro na exclusão.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={"user_id", "tmdb_id"})
    if not isinstance(valido, bool): 
        return valido

    return deletar_favorito(dados)
