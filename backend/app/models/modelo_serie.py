from app.models.modelo_midia import ModeloMidia


class Serie(ModeloMidia):
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
        dados = super().to_dict()
        dados.update({
            "num_episodios": self.num_episodios,
            "num_temporadas": self.num_temporadas,
            "status": self.status,
            "data_primeiro_ep": self.data_primeiro_ep,
            "tipo_midia": 1
        })
        return dados
