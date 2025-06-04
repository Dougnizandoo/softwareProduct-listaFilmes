from app.models import Usuario, modelo_resposta
from app.services import DB_postgres as DB
from app.utils import converter_data
import bcrypt
from app.utils import query_create, query_read, query_delete


# Create
def adicionar_usuario(dados: dict) -> dict:
    """
        Adiciona um novo usuário ao banco de dados, validando os dados fornecidos.

        Args:
            dados (dict): Dicionário com os dados do usuário enviados pelo frontend. 
                Deve conter: 'id', 'nome', 'data_nascimento', 'genero', 'email', 'senha'.
        Returns:
            dict: Resposta padronizada indicando sucesso ou falha na operação.
    """
    if _validar_conta_usuario(dados['email'], validar_so_email=True):
        return modelo_resposta(status="error", message="Email ja registrado!", status_code=400)

    if dados['genero'] == 3:
        dados['genero'] = 0

    usu = Usuario(dados['id'], dados['nome'], dados['data_nascimento'], dados['genero'], dados['email'], dados['senha'])
    query = query_create('usuarios', ['id', 'nome', 'dataNascimento', 'genero', 'email', 'senha'])
    resp = DB().modificar_banco(query=query, param=usu.to_list())
    if resp: 
        return modelo_resposta(message="Usuario Cadastrado com sucesso!", status_code=201)

    return modelo_resposta(status="error", message="Erro ao tentar cadastrar usuario no banco", status_code=500)


# Read
def buscar_usuario(email: str, senha: str) -> dict | bool:
    """
        Busca um usuário no banco de dados com base em email e senha.

        Args:
            email (str): E-mail do usuário.
            senha (str): Senha em texto plano.

        Returns:
            dict | bool: Um dicionário com os dados do usuário (sem a senha) se autenticado com sucesso,
            ou False se as credenciais forem inválidas.
    """
    if not _validar_conta_usuario(email=email, senha=senha): 
        return False

    query = query_read('usuarios', ['email'], ['id', 'nome', 'datanascimento', 'genero', 'email', 'senha'])
    dados = DB().buscar_banco(query, [email])
    if dados:
        dados = dados[0]
        usu = Usuario(dados[0], dados[1], dados[2], dados[3], dados[4])
        resp = usu.to_dict()
        resp.pop('senha')
        resp['data_nascimento'] = converter_data(str(resp['data_nascimento']))
        return resp
    return False

# Delete
def deletar_usuario(code: str, email: str, senha: str) -> dict:
    """
        Remove um usuário do banco de dados com base no ID, e-mail e senha.

        Args:
            code (str): ID do usuário.
            email (str): E-mail do usuário.
            senha (str): Senha do usuário.

        Returns:
            dict: Resposta padronizada com o resultado da operação.
    """
    if not _validar_conta_usuario(email=email, senha=senha):
        return modelo_resposta(status="error", message="Credenciais Invalidas", error='Email ou senha invalidos!', status_code=400)

    query = query_delete('usuarios', ['id', 'email'])
    resultado = DB().modificar_banco(query, [code, email])

    if resultado:
        return modelo_resposta(message="Usuário excluído com sucesso")

    return modelo_resposta(status="error", message="Erro ao Excluir", error="Erro no Banco de Dados", status_code=500)


def _validar_conta_usuario(email: str="", senha: str="", validar_so_email=False) -> bool:
    """
        Valida se um e-mail está cadastrado e, opcionalmente, se a senha está correta.

        Args:
            email (str): E-mail do usuário.
            senha (str, optional): Senha do usuário. Obrigatória se validar_so_email for False.
            validar_so_email (bool): Se True, verifica apenas se o e-mail existe no banco.

        Returns:
            bool: 
                - True: Se o e-mail existe (e a senha for válida, se fornecida).
                - False: Se o e-mail não estiver cadastrado ou a senha for inválida.
    """
    query = query_read('usuarios', ['email'], ['senha'])
    busca = DB().buscar_banco(query, [email])

    if not busca:
        print("❌ Email não encontrado no banco!")
        return False

    if validar_so_email:
        print("✅ Email encontrado!")
        return True

    senha_hash = busca[0][0]
    return bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf8'))
