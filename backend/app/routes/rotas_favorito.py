from flask import Blueprint, request
from app.services import adicionar_favorito, buscar_favorito, deletar_favorito
from app.models import modelo_resposta
from app.utils import str_para_int as converter, ValidarJSON


favApp = Blueprint("favApp", __name__)

# Buscar
@favApp.route("/Favorito/Read/<user_id>", methods=['GET'])
def favoritos_get(user_id: str):
    resp = buscar_favorito(user_id)
    return resp

# Adicionar
@favApp.route("/Favorito/Create", methods=['POST'])
def favoritos_setter():
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
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={"user_id", "tmdb_id"})
    if not isinstance(valido, bool): 
        return valido

    return deletar_favorito(dados)
