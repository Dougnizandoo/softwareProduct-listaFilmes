from flask import Blueprint
from app.utils import str_para_int
from app.services import buscar_colecao, buscar_midia
from app.models import modelo_resposta


bApp = Blueprint('bApp', __name__)

@bApp.route('/Busca/<tipo>/<busca>/<pagina>', methods=['GET'])
def searching_name(tipo: str, busca: str, pagina: str) -> dict:
    tipo_busca = str_para_int(tipo, ('0', '1'), 1)
    if type(tipo_busca) is not int: 
        return tipo_busca

    if not pagina.isnumeric():
        return modelo_resposta(status="error", message="Tipo de dados invalidos", error="O campo final tem que ser um numero inteiro", status_code=400)

    pagina = int(pagina)
    busca = busca.strip().replace(' ', '%20')
    conteudo = buscar_colecao(tipo_busca, busca, pagina)
    return modelo_resposta(data=conteudo)


@bApp.route('/Busca/<tipo>/<busca>', methods=['GET'])
def searching_id(tipo: str, busca: str) -> dict:
    tipo_busca = str_para_int(tipo, ('0', '1'), 1)
    if type(tipo_busca) is not int:
        return tipo_busca

    busca = buscar_midia(tipo_busca, busca)
    return modelo_resposta(data=busca)
