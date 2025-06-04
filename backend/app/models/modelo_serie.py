from app.models.modelo_midia import ModeloMidia


class Serie(ModeloMidia):
    """
        Classe que representa uma serie de tv, estendendo a estrutura base de ModeloMidia.

        Herda os atributos e métodos básicos de mídias e adiciona campos específicos de series, como número de episódios, temporadas, status da produção e data de estreia do primeiro episódio.

        Atributos:
            id (str): ID único da série (herdado de ModeloMidia).
            nome (str): Nome da série (herdado de ModeloMidia).
            poster (str): URL do pôster da série (herdado de ModeloMidia).
            genero (list): Lista de gêneros associados (herdado de ModeloMidia).
            descricao (str): Descrição/resumo da série (herdado de ModeloMidia).
            num_episodios (int): Número total de episódios da série.
            num_temporadas (int): Número total de temporadas da série.
            status (str): Status atual da série (ex: "Em produção", "Finalizada").
            data_primeiro_ep (str): Data de lançamento do primeiro episódio (formato 'YYYY-MM-DD').

        Args:
            num_episodios (int): Retorna o número total de episódios.
            num_temporadas (int): Retorna o número total de temporadas.
            status (str): Retorna o status atual da série.
            data_primeiro_ep (str): Retorna a data de lançamento do primeiro episódio.
    """
    def __init__(self, id: str='', nome: str='', poster: str='', genero: list=[], descricao: str='',
                num_episodios: int=0, num_temporadas: int=0, status: str='', data_primeiro_ep: str='0000-00-00'):
        super().__init__(id, nome, poster, genero, descricao)
        self._num_episodios = num_episodios
        self._num_temporadas = num_temporadas
        self._status = status
        self._data_primeiro_ep = data_primeiro_ep

    @property
    def num_episodios(self) -> int:
        return self._num_episodios

    @property
    def num_temporadas(self) -> int:
        return self._num_temporadas

    @property
    def status(self) -> str:
        return self._status

    @property
    def data_primeiro_ep(self) -> str:
        return self._data_primeiro_ep

    def to_dict(self) -> dict:
        """
            Converte os dados da série para um dicionário.

            Returns:
                dict: Dicionário com todos os atributos da série, incluindo os herdados de ModeloMidia
                    e adicionando o campo "tipo_midia" com valor 1 (indicando série).
        """
        dados = super().to_dict()
        dados.update({
            "num_episodios": self.num_episodios,
            "num_temporadas": self.num_temporadas,
            "status": self.status,
            "data_primeiro_ep": self.data_primeiro_ep,
            "tipo_midia": 1
        })
        return dados
