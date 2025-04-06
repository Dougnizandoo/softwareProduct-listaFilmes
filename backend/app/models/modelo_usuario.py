from uuid import uuid4
import bcrypt


class Usuario():
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
        lista = [self.id, self.nome, self.data_nascimento, self.genero, self.email, self.senha]
        return lista

    def __encrypitar_senha(self, senha: str):
        if senha.strip() != '':
            salt = bcrypt.gensalt()
            return bcrypt.hashpw(senha.encode('utf-8'), salt).decode('utf-8')
        return ''
