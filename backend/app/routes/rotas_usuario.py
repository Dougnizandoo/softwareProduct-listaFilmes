from flask import Blueprint, request
from app.models import modelo_resposta
from app.services import buscar_usuario, adicionar_usuario, deletar_usuario
from app.utils import ValidarJSON


userApp = Blueprint("userApp", __name__)

# Login
@userApp.route('/Usuario/Read', methods=['POST'])
def usuario_login():
    dados = request.get_json()
    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'email', 'senha'})
    if not isinstance(valido, bool): 
        return valido

    busca = buscar_usuario(dados['email'], dados['senha'])
    if not isinstance(busca, dict):
        resp = modelo_resposta(status="error", message="Usuario não encontrado", error='Usuario ou Senha invalidos!',status_code=401)
        return resp

    return modelo_resposta(message="Login Feito com sucesso!", data=busca)


# Registrar
@userApp.route('/Usuario/Create', methods=['POST'])
def usuario_registro():
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Requisição inválida", error="O corpo da requisição deve ser um JSON válido!", status_code=400)

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'nome', 'data_nascimento', 'genero', 'email', 'senha'})
    if not isinstance(valido, bool): 
        return valido

    return adicionar_usuario(dados)


# Excluir Conta
@userApp.route("/Usuario/Delete", methods=['DELETE'])
def usuario_excluir():
    dados = request.get_json()

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'id', 'email', 'senha'})
    if not isinstance(valido, bool): 
        return valido

    return deletar_usuario(code=dados['id'], email=dados['email'], senha=dados['senha'])
