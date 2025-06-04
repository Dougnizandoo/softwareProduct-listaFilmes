from uuid import uuid4
import bcrypt


class Usuario():
    """
        Modelo de dados para representar um usuário no sistema.

        A classe encapsula os dados principais de um usuário, como nome, data de nascimento,
        gênero, e-mail e senha (com opção de criptografia). Também oferece métodos para
        conversão do objeto em dicionário ou lista.

        Atributos:
            id (str): Identificador único do usuário (UUID gerado automaticamente se não fornecido).
            nome (str): Nome do usuário.
            data_nascimento (str): Data de nascimento no formato 'YYYY-MM-DD'.
            genero (int): Gênero do usuário (convenção numérica definida pelo sistema).
            email (str): E-mail do usuário.
            senha (str): Senha do usuário (criptografada por padrão).

        Args:
            code (str, optional): ID do usuário. Se não informado, um UUID será gerado.
            nome (str, optional): Nome do usuário.
            data_nascimento (str, optional): Data de nascimento (default: "0000-00-00").
            genero (int, optional): Gênero do usuário (default: 0).
            email (str, optional): E-mail do usuário.
            senha (str, optional): Senha do usuário.
            hash_senha (bool, optional): Define se a senha será criptografada no momento da criação. (default: True)
    """
    def __init__(self, code: str="", nome: str="", data_nascimento: str="0000-00-00", genero: int=0, email: str="", senha: str = "", hash_senha: bool= True):
        self._id = code if code.strip() != '' else str(uuid4())
        self._nome = nome
        self._data_nascimento = data_nascimento
        self._genero = genero
        self._email = email
        self._senha = self.__encrypitar_senha(senha) if hash_senha else senha

    def __str__(self):
        return f'Usuario: {self.nome} | ID: {self.id}'

    @property
    def id(self) -> str:
        return self._id

    @property
    def nome(self) -> str:
        return self._nome

    @property
    def data_nascimento(self) -> str:
        return self._data_nascimento

    @property
    def genero(self) -> int:
        return self._genero

    @property
    def email(self) -> str:
        return self._email

    @property
    def senha(self) -> str:
        return self._senha

    def to_dict(self) -> dict:
        """
            Converte os dados do usuário em um dicionário.

            Returns:
                dict: Dicionário com os dados do usuário.
        """
        dados = {
            "id": self.id,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "genero": self.genero,
            "email": self.email,
            "senha": self.senha
        }
        return dados

    def to_list(self) -> list:
        """
            Converte os dados do usuário em uma lista, útil para inserção no banco.

            Returns:
                list: Lista com os dados do usuário na ordem esperada.
        """
        lista = [self.id, self.nome, self.data_nascimento, self.genero, self.email, self.senha]
        return lista

    def __encrypitar_senha(self, senha: str):
        """
            Criptografa a senha utilizando bcrypt.

            Args:
                senha (str): Senha em texto plano.

            Returns:
                str: Senha criptografada.
        """
        if senha.strip() != '':
            salt = bcrypt.gensalt()
            return bcrypt.hashpw(senha.encode('utf-8'), salt).decode('utf-8')
        return ''
