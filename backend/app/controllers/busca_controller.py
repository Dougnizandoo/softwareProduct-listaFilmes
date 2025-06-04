from app.services import TMDB_API as api
from app.utils import remover_campos
from app.utils import ConverterGenero


# Buscar por nome
def buscar_colecao(tipo: int, busca: str, pagina: int) -> dict:
    """
        Retorna uma coleção de filmes ou séries com base em um termo de busca.

        Args:
            tipo (int): Tipo da mídia (0 = Filme, 1 = Série).
            busca (str): Termo de busca digitado pelo usuário.
            pagina (int): Número da página dos resultados.
        Returns:
            dict: retorna um dicionario formatado com os modelos de filme ou serie.
    """
    chamada = api().buscar_por_nome(tipo, busca, pagina)
    if len(chamada['busca']) != 0:
        for midia in chamada['busca']:
            if tipo == 0:
                midia = remover_campos(midia, ['arrecadou', 'duracao', 'pais_origem'])
            
            else:
                midia = remover_campos(midia, ['num_episodios', 'num_temporadas', 'status'])

            midia = ConverterGenero(midia)
    return chamada


# Buscar por ID
def buscar_midia(tipo: int, busca: str) -> dict:
    """
        Realiza uma busca por ID no TMDB e retorna os dados detalhados da mídia.

        Args:
            tipo (int): Tipo da mídia (0 = Filme, 1 = Série).
            busca (str): ID da mídia no TMDB.
        Returns:
            JSON: Resposta de sucesso ou erro dependendo da validação ou resultado da operação.
    """
    chamada = api().buscar_por_id(tipo=tipo, id=busca)
    chamada = ConverterGenero(chamada, True)
    return chamada
