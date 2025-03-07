from flask import Flask, make_response, request
from system import buscar_usuario, adicionar_usuario, deletar_usuario, validar_conta_usuario
from flask_cors import CORS
from lib.Models import get_modelo_json


app = Flask(__name__)
CORS(app, supports_credentials=True)


# Login
@app.route('/Usuario/Login', methods=['POST'])
def usuario_login():
    dados = request.get_json()
    if not dados.get('email') or not dados.get('senha'):
        return get_modelo_json(status="error", message="Credenciais insuficientes", error="O json deve conter as chavers 'email' e 'senha' para realizar o login!", status_code=400)
    busca = buscar_usuario(dados['email'], dados['senha'])
    if not busca or not isinstance(busca, dict):
        return get_modelo_json(status="error", message="Usuario não encontrado", error='Usuario ou Senha invalidos!',status_code=401)
    resp = make_response(get_modelo_json(message="Login Feito com sucesso!", data=busca))
    return resp


# Registrar
@app.route('/Usuario/Registro', methods=['POST'])
def usuario_registro():
    dados = request.get_json()
    if not dados:
        return get_modelo_json(status="error", message="Requisição inválida", error="O corpo da requisição deve ser um JSON válido!", status_code=400)
    if "id" not in dados.keys():
        dados["id"] = ""
    chaves_obrigatorias = ['id', 'nome', 'dataNascimento', 'genero', 'email', 'senha']
    if any(chave not in dados for chave in chaves_obrigatorias):
        return get_modelo_json(status="error", message="Credenciais insuficientes", error=f'O arquivo json deve conter os campos {chaves_obrigatorias} para realizar o registro!', status_code=400)
    if validar_conta_usuario(email=dados['email'], validar_so_email=True):
        return get_modelo_json(status="error", message="Email ja registrado!", status_code=400)
    if adicionar_usuario(dados):
        return get_modelo_json(message="Usuario Cadastrado com sucesso!")
    return get_modelo_json(status="error", message="Erro ao tentar cadastrar usuario no banco", status_code=500)


# Excluir Conta
@app.route("/Usuario/Excluir", methods=['DELETE'])
def usuario_excluir():
    dados = request.get_json(silent=True)
    chaves_obrigatorias = ['id', 'email', 'senha']
    for chave in chaves_obrigatorias:
        if chave not in dados.keys():
            return get_modelo_json(status="error", message="Campos Obrigatorios Ausentes", error=f'O json deve conter os campos {chaves_obrigatorias} para realizar uma Exclusão!', status_code=400)
    if deletar_usuario(code=dados['id'], email=dados['email'], senha=dados['senha']) is False:
        return get_modelo_json(status="error", message="Credenciais Invalidas", error='Os dados fornecidos não condizem com nenhum registro!', status_code=400)
    resp = make_response(get_modelo_json(message="Usuario Excluido com sucesso"))
    return resp


if __name__ == "__main__":
    app.run(host='localhost', port=2323, debug=True)
