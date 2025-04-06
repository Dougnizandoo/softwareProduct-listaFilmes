from app.services import TMDB_API as api
from app.models import EnumGenero as Genero
from app.utils import remover_campos
from app.utils import ConverterGenero


# Lista de Busca
def buscar_colecao(tipo: int, busca: str, pagina: int) -> dict:
    """
        -> Metodo para realizar buscas de filmes e series na api.

        Args:
            tipo (int): 0 para filme ou 1 para serie.
            busca (str): Conteudo que deseja pesquisar.
            pagina (int): Numero da pagina
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


def buscar_midia(tipo: int, busca: str) -> dict:
    chamada = api().buscar_por_id(tipo=tipo, id=busca)
    chamada = ConverterGenero(chamada, True)
    return chamada
