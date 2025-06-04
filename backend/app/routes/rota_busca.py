from flask import Blueprint
from app.utils import str_para_int
from app.controllers import buscar_colecao, buscar_midia
from app.models import modelo_resposta


# Blueprint para rotas relacionadas à busca na API externa (TMDB).
bApp = Blueprint('bApp', __name__)

# Busca por titulo
@bApp.route('/Busca/<tipo>/<busca>/<pagina>', methods=['GET'])
def searching_name(tipo: str, busca: str, pagina: str) -> dict:
    """
        Retorna uma lista de mídias com base em uma busca por título.

        Args:
            tipo (str): Tipo da mídia (0 = Filme, 1 = Série).
            busca (str): Termo de busca digitado pelo usuário.
            pagina (int): Número da página dos resultados.
        Returns:
            JSON: Resposta padronizada contendo os resultados da busca ou mensagem de erro.
    """
    tipo_busca = str_para_int(tipo, ('0', '1'), 1)
    if type(tipo_busca) is not int: 
        return tipo_busca

    if not pagina.isnumeric():
        return modelo_resposta(status="error", message="Tipo de dados invalidos", error="O campo final tem que ser um numero inteiro", status_code=400)

    pagina = int(pagina)
    busca = busca.strip().replace(' ', '%20')
    conteudo = buscar_colecao(tipo_busca, busca, pagina)
    return modelo_resposta(data=conteudo)


# Busca por ID
@bApp.route('/Busca/<tipo>/<busca>', methods=['GET'])
def searching_id(tipo: str, busca: str) -> dict:
    """
        Realiza uma busca por ID no TMDB e retorna os detalhes da mídia.

        Args:
            tipo (str): Tipo da mídia (0 = Filme, 1 = Série).
            busca (str): ID da mídia (referente ao TMDB).
        Returns:
            JSON: Resposta padronizada contendo os detalhes da mídia ou mensagem de erro.
    """
    tipo_busca = str_para_int(tipo, ('0', '1'), 1)
    if type(tipo_busca) is not int:
        return tipo_busca

    busca = buscar_midia(tipo_busca, busca)
    return modelo_resposta(data=busca)
