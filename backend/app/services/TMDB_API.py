import requests
from app.models import Filme, Serie
from dotenv import load_dotenv
import os


load_dotenv()
class TMDB_API:
    """
        -> Classe para fazer pesquisa na api via id ou via nome.
    """
    def __init__(self):
        self._api_key = f'api_key={os.getenv("TMDB_API_KEY")}'
        self._imagem = 'https://image.tmdb.org/t/p/w500'
        self._url = 'https://api.themoviedb.org/3/'
        self._tipo_conteudo = ('movie', 'tv')

    @property
    def api_key(self):
        return self._api_key

    @property
    def imagem(self):
        return self._imagem

    @property
    def url(self):
        return self._url

    @property
    def tipo_conteudo(self):
        return self._tipo_conteudo

    # get one
    def buscar_por_id(self, tipo: int, id: str) -> dict:
        """
            -> Metodo para consultar a api via id.

            Args:
                tipo (int): 0 para filme e 1 para serie.
                id (str): id que gostaria de usar.
            Returns:
                dict: Retorna um dicionario com os campos do 'tipo' desejado
        """
        destino = f'{self.tipo_conteudo[tipo]}/{id}?language=pt-BR&{self.api_key}'
        self._url += destino
        busca = requests.get(self.url).json()
        self._imagem += str(busca['poster_path'])
        if tipo == 0:
            resposta = Filme(busca['id'], busca['title'], self.imagem, busca['genres'], busca['overview'], busca['runtime'], busca['origin_country'], busca['revenue'], busca['release_date'])
        else:
            resposta = Serie(busca['id'], busca['name'], self.imagem, busca['genres'], busca['overview'], busca['number_of_episodes'], busca['number_of_seasons'], busca['status'], busca['first_air_date'])

        return resposta.to_dict()

    # get all
    def buscar_por_nome(self, tipo: int, nome: str, pagina: int=1) -> dict:
        """
            -> Metodo para consultar a api via nome.

            Args:
                tipo (int): 0 para Filmes e 1 para Series
                nome (str): consulta que gostaria de fazer na api
                pagina (int, opcional): numero da pagina da consulta, valor padrão é 1.
            Returns:
                dict: Retorna um dicionario com a pagina atual, o total de paginas da busca e os resultados.
        """
        destino = f'search/{self.tipo_conteudo[tipo]}?query={nome}&include_adult=false&language=pt-BR&page={pagina}&{self.api_key}'
        self._url += destino
        pesquisa = requests.get(self.url).json()

        lista = []
        if pesquisa['total_results'] > 0:
            for busca in pesquisa['results']:
                imagem_midia = self.imagem + str(busca['poster_path'])
                if tipo == 0:
                    midia = Filme(id=busca['id'], nome=busca['title'], genero=busca['genre_ids'], poster=imagem_midia, data_lancamento=busca['release_date'], descricao=busca['overview'])
                else:
                    midia = Serie(id=busca['id'], nome=busca['name'], genero=busca['genre_ids'], poster=imagem_midia, descricao=busca['overview'], data_primeiro_ep=busca['first_air_date'])

                lista.append(midia.to_dict())
        resp = {
            'pagina': pesquisa['page'],
            'total_paginas': pesquisa['total_pages'],
            'busca': lista
        }
        return resp
