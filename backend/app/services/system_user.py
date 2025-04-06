from app.models import Usuario, modelo_resposta
from app.services import DB_postgres as DB
from app.utils import converter_data
import bcrypt


def buscar_usuario(email: str, senha: str) -> dict | bool:
    """
        -> Metodo de busca no banco por um usuario correspondente aos parametros.

        Args:
            email (str): Email do usuario desejado.
            senha (str): Senha do usuario desejado.
        Returns:
                dict | bool: Retorna um dicionario com os dados em caso de sucesso, caso contrario retorna False.
    """
    if not _validar_conta_usuario(email=email, senha=senha): 
        return False

    query = "SELECT t.id, t.nome, t.dataNascimento, t.genero, t.email FROM impacta.usuarios t WHERE t.email=%s;"
    dados = DB().buscar_banco(query, [email])
    if dados:
        dados = dados[0]
        usu = Usuario(dados[0], dados[1], dados[2], dados[3], dados[4])
        resp = usu.to_dict()
        resp.pop('senha')
        resp['data_nascimento'] = converter_data(str(resp['data_nascimento']))
        return resp
    return False


def adicionar_usuario(dados: dict) -> dict:
    """
        -> Metodo que avalia dicionario e verifica se ele tem dados validos para ser adicionado ao banco.

        Args:
            dados (dict) -> Dicionario recebido do front para analise.
        Returns:
            bool: Volta True caso os dados tenham sido adicionados ou false caso contrario.
    """
    if _validar_conta_usuario(dados['email'], validar_so_email=True):
        return modelo_resposta(status="error", message="Email ja registrado!", status_code=400)

    if dados['genero'] == 3:
        dados['genero'] = 0

    usu = Usuario(dados['id'], dados['nome'], dados['data_nascimento'], dados['genero'], dados['email'], dados['senha'])
    query = "INSERT INTO impacta.usuarios (id, nome, dataNascimento, genero, email, senha) VALUES (%s, %s, %s, %s, %s, %s);"
    resp = DB().modificar_banco(query=query, param=usu.to_list())
    if resp: 
        return modelo_resposta(message="Usuario Cadastrado com sucesso!", status_code=201)

    return modelo_resposta(status="error", message="Erro ao tentar cadastrar usuario no banco", status_code=500)


def deletar_usuario(code: str, email: str, senha: str) -> dict:
    """
        -> Metodo para exclusão de dados no banco, caso os parametros sejam validos.

        Args:
            code (str): id do usuario que deseja excluir.
            email (str): email do usuario que deseja excluir.
            senha (str): senha do usuario que deseja excluir.
        Returns:
            bool: Retorna True caso a ação tenha sido realizada ou False caso contrario.
    """
    if not _validar_conta_usuario(email=email, senha=senha):
        return modelo_resposta(status="error", message="Credenciais Invalidas", error='Email ou senha invalidos!', status_code=400)

    query = "DELETE FROM impacta.usuarios WHERE id=%s AND email=%s;"
    resultado = DB().modificar_banco(query, [code, email])

    if resultado:
        return modelo_resposta(message="Usuário excluído com sucesso")

    return modelo_resposta(status="error", message="Erro ao Excluir", error="Erro no Banco de Dados", status_code=500)


def _validar_conta_usuario(email: str="", senha: str="", validar_so_email=False) -> bool:
    """
        -> Metodo para procurar no banco de dados se existe um usuario com os parametros correspondentes.

        Args:
            email (str): Email a ser procurado.
            senha (str): Senha a ser procurada.
            validar_so_email (bool): True para verificar se o email já esta cadastro no banco.
        Returns:
            bool:   False -> Se não encontrar dados correspondentes no banco. Caso validar_so_email seja True, retornara false caso não encontre o email no banco.
                    True -> Se email e senha for valido com os dados do banco. Caso validdar_so_email seja True, retorna true se encontrar email correspondente.
    """
    query = "SELECT t.senha FROM impacta.usuarios t WHERE t.email=%s"
    busca = DB().buscar_banco(query, [email])

    if not busca:
        print("❌ Email não encontrado no banco!")
        return False

    if validar_so_email:
        print("✅ Email encontrado!")
        return True

    senha_hash = busca[0][0]
    return bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf8'))
