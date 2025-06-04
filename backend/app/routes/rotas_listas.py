from flask import Blueprint, request
from app.controllers import buscar_lista, adicionar_lista, deletar_lista
from app.models import modelo_resposta
from app.utils import ValidarJSON


# Blueprint para rotas relacionadas as listas personalizadas dos usuarios
listasApp = Blueprint('listasApp', __name__)

@listasApp.route("/Listas/Read/<user_id>", methods=['GET'])
def listas_get(user_id: str):
    """
        Retorna todas as listas que foram criadas de um usuário específico.

        Args:
            user_id (str): ID do usuário cuja listas devem ser recuperadas.
        Returns:
            JSON: Lista com todas as listas do usuário ou mensagem de erro se o usuário não for encontrado.
    """
    resp = buscar_lista(user_id)
    return resp


@listasApp.route("/Listas/Create", methods=['POST'])
def listas_setter():
    """
        Cria uma nova lista para um usuário.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera-se um JSON no corpo da requisição com os campos:
                - user_id (str): ID do usuário.
                - table_nome (str): Nome da lista a ser criada.
        Returns:
            JSON: Resposta de sucesso ou erro dependendo da validação ou resultado da operação.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'user_id', 'table_nome'})
    if not isinstance(valido, bool): 
        return valido
    
    return adicionar_lista(dados)


@listasApp.route("/Listas/Delete", methods=['DELETE'])
def listas_delete():
    """
        Deleta uma lista personalizada de um usuario.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera receber um arquivo JSON com as seguintes chaves:
                - user_id (str): ID do usuário.
                - table_id (str): ID da lista a ser removida.
        Returns:
            JSON: Resposta de sucesso ou erro dependendo da validação ou resultado da operação.
    """
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'user_id', 'table_id'})
    if not isinstance(valido, bool): 
        return valido
    
    return deletar_lista(dados)
