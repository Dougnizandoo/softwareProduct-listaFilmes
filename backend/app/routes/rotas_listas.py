from flask import Blueprint, request
from app.services import buscar_lista, adicionar_lista, deletar_lista
from app.models import modelo_resposta
from app.utils import ValidarJSON


listasApp = Blueprint('listasApp', __name__)

@listasApp.route("/Listas/Read/<user_id>", methods=['GET'])
def listas_get(user_id: str):
    resp = buscar_lista(user_id)
    return resp


@listasApp.route("/Listas/Create", methods=['POST'])
def listas_setter():
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'user_id', 'table_nome'})
    if not isinstance(valido, bool): 
        return valido
    
    return adicionar_lista(dados)


@listasApp.route("/Listas/Delete", methods=['DELETE'])
def listas_delete():
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'user_id', 'table_id'})
    if not isinstance(valido, bool): 
        return valido
    
    return deletar_lista(dados)
