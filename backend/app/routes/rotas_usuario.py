from flask import Blueprint, request
from app.models import modelo_resposta
from app.controllers import buscar_usuario, adicionar_usuario, deletar_usuario
from app.utils import ValidarJSON


# Blueprint para rotas relacionadas ao usuário
userApp = Blueprint("userApp", __name__)

# Login
@userApp.route('/Usuario/Read', methods=['POST'])
def usuario_login():
    """
        Realiza o login de um usuário com base em email e senha.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera-se JSON no corpo da requisição com os campos: 
                - email (str): E-mail do usuário.
                - senha (str): Senha do usuário.
        Returns:
            JSON: Resposta padronizada com os dados do usuário se autenticado com sucesso,
                ou mensagem de erro caso contrário.
    """
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
    """
        Registra um novo usuário com os dados fornecidos.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera-se um JSON no corpo da requisição com os campos:
                - nome (str): Nome completo do usuário.
                - data_nascimento (str): Data de nascimento no formato 'YYYY-MM-DD'.
                - genero (str): Gênero do usuário.
                - email (str): E-mail do usuário.
                - senha (str): Senha do usuário.
        Returns:
            JSON: Resposta indicando sucesso ou erro no cadastro.
    """
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
    """
        Remove um usuário do sistema com base nos dados fornecidos.

        Args:
            Nenhum argumento posicional é passado diretamente.
            Espera receber um arquivo JSON com as seguintes chaves:
                - id (str): ID do usuário.
                - email (str): E-mail do usuário.
                - senha (str): Senha do usuário.
        Returns:
            JSON: Resposta indicando sucesso ou erro ao tentar deletar a conta.
    """
    dados = request.get_json()

    valido = ValidarJSON(dados=dados, chaves_obrigatorias={'id', 'email', 'senha'})
    if not isinstance(valido, bool): 
        return valido

    return deletar_usuario(code=dados['id'], email=dados['email'], senha=dados['senha'])
