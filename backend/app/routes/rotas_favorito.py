from flask import Blueprint, request
from app.services import adicionar_favorito, buscar_favorito, deletar_favorito
from app.models import modelo_resposta
from app.utils import str_para_int as converter


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

    chaves_obrigatorias = {'user_id', 'tmdb_id', 'tipo_midia'}
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Campos chave em falta", error=f'Para adicionar um novo favorito as seguintes chaves devem estar presentes: {chaves_obrigatorias}', status_code=400)

    for chave in chaves_obrigatorias:
        if not dados[chave] or not str(dados[chave]).strip():
            return modelo_resposta(status="error", message="Chave sem valor", error=f'A chave: {chave} não pode ser um valor nulo!', status_code=400)

    return adicionar_favorito(dados)


# Remover
@favApp.route("/Favorito/Delete", methods=["DELETE"])
def favoritos_delete():
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Arquivo JSON vazio!", status_code=400)
    
    chaves_obrigatorias = {"user_id", "tmdb_id"}
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Campos chave em falta", error=f'Para remover um favorito as seguintes chaves devem estar presentes: {chaves_obrigatorias}', status_code=400)

    for chave in chaves_obrigatorias:
        if not dados[chave] or not str(dados[chave]).strip():
            return modelo_resposta(status="error", message="Chave sem valor", error=f'A chave: {chave} não pode ser um valor nulo!', status_code=400)

    return deletar_favorito(dados)
