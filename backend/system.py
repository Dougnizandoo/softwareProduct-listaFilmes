import bcrypt
from lib.DataBase import DB
from lib.Models import get_modelo_usuario
from uuid import uuid4
from datetime import datetime


def adicionar_usuario(dados: dict) -> bool:
    """
        -> Metodo que avalia dicionario e verifica se ele tem dados validos para ser adicionado ao banco.

        Args:
            dados (dict) -> Dicionario recebido do front para analise.
        Returns:
            bool: Volta True caso os dados tenham sido adicionados ou false caso contrario.
    """
    campos_obrigatorios = ['id', 'nome', 'dataNascimento', 'genero', 'email', 'senha']

    dados['id'] = str(uuid4()) if not dados.get('id') else dados['id'].strip()
    for campo in campos_obrigatorios:
        if not dados.get(campo):
            print(f'Campo de criação ausente: {campo}')
            return False

    if dados['genero'] == 3:
        dados['genero'] = 0
    salt = bcrypt.gensalt()
    dados['senha'] = bcrypt.hashpw(dados['senha'].encode('utf-8'), salt).decode('utf-8')

    valores = [dados['id'], dados['nome'], dados['dataNascimento'], dados['genero'], dados['email'], dados['senha']]
    query = "INSERT INTO impacta.usuarios (id, nome, dataNascimento, genero, email, senha) VALUES (%s, %s, %s, %s, %s, %s);"

    resp = DB().modificar_banco(query=query, param=valores)
    return resp


def deletar_usuario(code: str, email: str, senha: str) -> bool:
    """
        -> Metodo para exclusão de dados no banco, caso os parametros sejam validos.

        Args:
            code (str): id do usuario que deseja excluir.
            email (str): email do usuario que deseja excluir.
            senha (set): senha do usuario que deseja excluir.
        Returns:
            bool: Retorna True caso a ação tenha sido realizada ou False caso contrario.
    """
    if not validar_conta_usuario(email=email, senha=senha, validar_so_email=False):
        return False
    query = 'SELECT t.id FROM impacta.usuarios t WHERE t.id=%s'
    busca = DB().buscar_banco(query, [code])
    if not busca:
        return False
    query = "DELETE FROM impacta.usuarios WHERE id = %s AND email = %s AND senha = (SELECT senha FROM impacta.usuarios WHERE email = %s);"
    return DB().modificar_banco(query, [code, email, email])


def buscar_usuario(email: str, senha: str) -> dict | bool:
    """
        -> Metodo de busca no banco por um usuario correspondente aos parametros.

        Args:
            email (str): Email do usuario desejado.
            senha (str): Senha do usuario desejado.
        Returns:
                dict | bool: Retorna um dicionario com os dados em caso de sucesso, caso contrario retorna False.
    """
    if not validar_conta_usuario(email=email, senha=senha):
        return False
    query = "SELECT t.id, t.nome, t.dataNascimento, t.genero, t.email FROM impacta.usuarios t WHERE t.email=%s;"
    dados = DB().buscar_banco(query, [email])
    if dados:
        dici = dados[0]
        resp = get_modelo_usuario(dici[0], dici[1], dici[2], dici[3], dici[4])
        resp.pop('senha')
        resp['dataNascimento'] = converter_data(str(resp['dataNascimento']))
        return resp
    return False


def validar_conta_usuario(email: str="", senha: str="", validar_so_email=False) -> bool:
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
        return False
    if validar_so_email is True:
        return True
    senha_hash = busca[0][0]
    return bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf8'))


def converter_data(data: str) -> str:
    """
        -> Metodo para formatar a data recebida pelo banco.

        Args:
            data (str): Data do banco em formato de string.
        Returns:
            str: Retorna a data convertida.
    """
    cover = data.split("-")
    resp = str(f'{cover[2]}/{cover[1]}/{cover[0]}')
    return resp
