from abc import ABC, abstractmethod


class ModeloMidia(ABC):
    def __init__(self, id: str, nome: str, poster: str, genero: list, descricao: str):
        self._id = id
        self._nome = nome
        self._poster = poster
        self._genero = genero
        self._descricao = descricao

    def __str__(self):
        return f'Nome: {self.nome} | ID: {self.id}'

    @property
    def id(self) -> str:
        return self._id

    @property
    def nome(self) -> str:
        return self._nome

    @property
    def poster(self) -> str:
        return self._poster

    @property
    def genero(self) -> list:
        return self._genero

    @property
    def descricao(self) -> str:
        return self._descricao

    @abstractmethod
    def to_dict(self) -> dict:
        dados = {
            "id": self.id,
            "nome": self.nome,
            "poster": self.poster,
            "genero": self.genero,
            "descricao": self.descricao
        }
        return dados
