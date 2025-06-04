from abc import ABC, abstractmethod


class ModeloMidia(ABC):
    """
        Classe abstrata base que define a estrutura comum para objetos de mídia, como filmes ou séries.

        Esta classe estabelece os atributos essenciais e uma interface obrigatória (`to_dict`) que todas as
        subclasses devem implementar. Serve como modelo para representar qualquer tipo de conteúdo audiovisual.

        Atributos:
            id (str): Identificador único da mídia.
            nome (str): Nome ou título da mídia.
            poster (str): URL da imagem de capa/poster da mídia.
            genero (list): Lista de gêneros associados à mídia.
            descricao (str): Descrição ou sinopse da mídia.
        
        Args:
            id (str): ID único da mídia.
            nome (str): Nome ou título da mídia.
            poster (str): Caminho ou URL da imagem de capa.
            genero (list): Lista de gêneros (strings) da mídia.
            descricao (str): Sinopse ou descrição do conteúdo.
    """
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
        """
            Converte os dados da midia para um dicionario.

            Returns:
                dict: Representação em dicionário dos atributos da mídia.
            Obs:
                Este método deve ser obrigatoriamente implementado por todas as subclasses.
        """
        dados = {
            "id": self.id,
            "nome": self.nome,
            "poster": self.poster,
            "genero": self.genero,
            "descricao": self.descricao
        }
        return dados
