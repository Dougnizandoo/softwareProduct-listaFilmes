from flask import Blueprint, request
from app.services import adicionar_lista_registro, deletar_lista_registro, buscar_lista_registro
from app.models import modelo_resposta
from app.utils import ValidarJSON


regApp = Blueprint("regApp", __name__)

# Buscar
@regApp.route("/Listas/Registro/Read/<table_id>", methods=['GET'])
def listas_registro_get(table_id: str):
    resp = buscar_lista_registro(table_id)
    return resp

# Adicionar
@regApp.route("/Listas/Registro/Create", methods=['POST'])
def listas_registro_setter():
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
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={"table_id", "tmdb_id"})
    if not isinstance(valido, bool): 
        return valido

    return deletar_lista_registro(dados)
