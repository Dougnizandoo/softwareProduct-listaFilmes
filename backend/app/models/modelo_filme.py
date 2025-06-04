from app.models.modelo_midia import ModeloMidia


class Filme(ModeloMidia):
    """
        Classe que representa um filme, estendendo a estrutura base de ModeloMidia.

        Herda os atributos e métodos básicos de mídias e adiciona campos específicos de filmes, como duração, país de origem, arrecadação e data de lançamento.

        Atributos:
            id (str): ID único do Filme (herdado de ModeloMidia).
            nome (str): Nome do Filme (herdado de ModeloMidia).
            poster (str): URL do pôster do filme (herdado de ModeloMidia).
            genero (list): Lista de gêneros associados (herdado de ModeloMidia).
            descricao (str): Descrição/resumo do filme (herdado de ModeloMidia).
            duracao (int): Duração do filme em minutos.
            pais_origem (list): Lista de países de origem do filme.
            arrecadou (int): Valor arrecadado em bilheteria (em dólares, por exemplo).
            data_lancamento (str): Data de lançamento do filme no formato YYYY-MM-DD.
        
        Args:
            duracao (int): Duração do filme em minutos.
            pais_origem (list): Lista de países de origem.
            arrecadou (int): Valor arrecadado em bilheteria.
            data_lancamento (str): Data de lançamento no formato 'YYYY-MM-DD'.
    """
    def __init__(self, id: str= '', nome: str='', poster: str='', genero: list= [], descricao: str='',
                duracao: int= 0, pais_origem: list=[], arrecadou: int=0, data_lancamento: str='0000-00-00'):
        super().__init__(id, nome, poster, genero, descricao)
        self._duracao = duracao
        self._pais_origem = pais_origem
        self._arrecadou = arrecadou
        self._data_lancamento = data_lancamento

    @property
    def duracao(self) -> int:
        return self._duracao

    @property
    def pais_origem(self) -> str:
        return self._pais_origem

    @property
    def arrecadou(self) -> int:
        return self._arrecadou

    @property
    def data_lancamento(self) -> str:
        return self._data_lancamento

    def to_dict(self) -> dict:
        """
            Converte os dados do filme para um dicionário.

            Returns:
                dict: Dicionário com todos os atributos do filme, incluindo os herdados de ModeloMidia
                    e adicionando o campo "tipo_midia" com valor 0 (indicando filme).
        """
        dados = super().to_dict()
        dados.update({
            "duracao": self.duracao,
            "pais_origem": self.pais_origem,
            "arrecadou": self.arrecadou,
            "data_lancamento": self.data_lancamento,
            "tipo_midia": 0
        })
        return dados
