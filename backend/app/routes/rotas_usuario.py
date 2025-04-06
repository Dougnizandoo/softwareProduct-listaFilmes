from flask import Blueprint, request
from app.models import modelo_resposta
from app.services import buscar_usuario, adicionar_usuario, deletar_usuario


userApp = Blueprint("userApp", __name__)

# Login
@userApp.route('/Usuario/Login', methods=['POST'])
def usuario_login():
    dados = request.get_json()
    chaves_obrigatorias = {'email', 'senha'}
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Credenciais insuficientes", error=f'O json deve conter as chaves {chaves_obrigatorias} para realizar o login!', status_code=400)

    busca = buscar_usuario(dados['email'], dados['senha'])
    if not isinstance(busca, dict):
        resp = modelo_resposta(status="error", message="Usuario não encontrado", error='Usuario ou Senha invalidos!',status_code=401)
        return resp

    return modelo_resposta(message="Login Feito com sucesso!", data=busca)


# Registrar
@userApp.route('/Usuario/Registro', methods=['POST'])
def usuario_registro():
    dados = request.get_json()
    if not dados:
        return modelo_resposta(status="error", message="Requisição inválida", error="O corpo da requisição deve ser um JSON válido!", status_code=400)

    modelo_usuario = {'id', 'nome', 'data_nascimento', 'genero', 'email', 'senha'}
    if not modelo_usuario.issubset(dados):
        return modelo_resposta(status="error", message="Credenciais insuficientes", error=f'O arquivo json deve conter os campos {modelo_usuario} para realizar o registro!', status_code=400)
    return adicionar_usuario(dados)


# Excluir Conta
@userApp.route("/Usuario/Excluir", methods=['DELETE'])
def usuario_excluir():
    dados = request.get_json()
    chaves_obrigatorias = {'id', 'email', 'senha'}
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Campos Obrigatorios Ausentes", error=f'O json deve conter os campos {chaves_obrigatorias} para realizar uma Exclusão!', status_code=400)

    return deletar_usuario(code=dados['id'], email=dados['email'], senha=dados['senha'])
