import requests
from app.models import Filme, Serie
from dotenv import load_dotenv
import os


load_dotenv()
class TMDB_API:
    """
        Classe responsável por realizar pesquisas na API do The Movie Database (TMDB)
        utilizando nome ou ID de filmes e séries.

        A API key é carregada automaticamente na variáveis de ambiente
        definidas no arquivo `.env`.
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
            Consulta a API da TMDB utilizando o ID de um filme ou série.

            Args:
                tipo (int): 0 para filme e 1 para serie.
                id (str): ID do conteúdo a ser buscado.
            Returns:
                dict: Dicionário contendo os dados estruturados da mídia.
        """
        destino = f'{self.tipo_conteudo[tipo]}/{id}?language=pt-BR&{self.api_key}'
        self._url += destino
        busca = requests.get(self.url).json()
        self._imagem += str(busca['poster_path'])
        if tipo == 0:
            resposta = Filme(busca['id'], 
                            busca['title'], 
                            self.imagem, 
                            busca['genres'], 
                            busca['overview'], 
                            busca['runtime'], 
                            busca['origin_country'], 
                            busca['revenue'], 
                            busca['release_date'])
        else:
            resposta = Serie(busca['id'], 
                            busca['name'], 
                            self.imagem, 
                            busca['genres'], 
                            busca['overview'], 
                            busca['number_of_episodes'], 
                            busca['number_of_seasons'], 
                            busca['status'], 
                            busca['first_air_date'])

        return resposta.to_dict()

    # get all
    def buscar_por_nome(self, tipo: int, nome: str, pagina: int=1) -> dict:
        """
            Consulta a API da TMDB buscando por nome de filme ou série.

            Args:
                tipo (int): 0 para Filmes, 1 para Series.
                nome (str): Nome da mídia a ser pesquisada.
                pagina (int, opcional): Página da busca (padrão é 1).
            Returns:
                dict: Dicionário com a página atual, total de páginas e lista de resultados.
        """
        destino = f'search/{self.tipo_conteudo[tipo]}?query={nome}&include_adult=false&language=pt-BR&page={pagina}&{self.api_key}'
        self._url += destino
        pesquisa = requests.get(self.url).json()

        lista = []
        if pesquisa['total_results'] > 0:
            for busca in pesquisa['results']:
                imagem_midia = self.imagem + str(busca['poster_path'])
                if tipo == 0:
                    midia = Filme(id=busca['id'],
                                nome=busca['title'], 
                                genero=busca['genre_ids'], 
                                poster=imagem_midia, 
                                data_lancamento=busca['release_date'], 
                                descricao=busca['overview'])
                else:
                    midia = Serie(id=busca['id'], 
                                nome=busca['name'], 
                                genero=busca['genre_ids'], 
                                poster=imagem_midia, 
                                descricao=busca['overview'], 
                                data_primeiro_ep=busca['first_air_date'])

                lista.append(midia.to_dict())
        resp = {
            'pagina': pesquisa['page'],
            'total_paginas': pesquisa['total_pages'],
            'busca': lista
        }
        return resp
