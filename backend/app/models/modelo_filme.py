from app.models.modelo_midia import ModeloMidia


class Filme(ModeloMidia):
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
        dados = super().to_dict()
        dados.update({
            "duracao": self.duracao,
            "pais_origem": self.pais_origem,
            "arrecadou": self.arrecadou,
            "data_lancamento": self.data_lancamento,
            "tipo_midia": 0
        })
        return dados
