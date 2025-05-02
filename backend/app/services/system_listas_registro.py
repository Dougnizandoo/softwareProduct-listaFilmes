from app.models import modelo_resposta
from app.services import DB_postgres as DB
from app.services import TMDB_API as API
from app.utils import ConverterGenero


# Adicionar
def adicionar_lista_registro(dados: dict):
    query = 'INSERT INTO impacta.listas_registro (table_id, tmdb_id, tipo_midia) VALUES (%s, %s, %s);'
    try:
        resp = DB().modificar_banco(query, [ dados['table_id'], dados['tmdb_id'], dados['tipo_midia'] ])
        if not resp:
            return modelo_resposta(status="error", message="Erro de registro", error="A lista já possui essa midia ou table_id é invalido!", status_code=409)
        
        return modelo_resposta(message="Midia adicionada com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Remover
def deletar_lista_registro(dados: dict):
    query = "DELETE FROM impacta.listas_registro WHERE table_id=%s AND tmdb_id=%s;"
    try:
        resp = DB().modificar_banco(query, [dados['table_id'], dados['tmdb_id']])
        return modelo_resposta(data=resp, message="Midia removida da lista com sucesso!")
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar remover dado ao banco", error=err, status_code=500)


# Ler
def buscar_lista_registro(table_id: str):
    query = 'SELECT t.tmdb_id, t.tipo_midia from impacta.listas_registro t WHERE t.table_id = %s ;'
    dados = DB().buscar_banco(query, [table_id])
    if len(dados) == 0:
        return modelo_resposta(message='Lista vazia', error='Nenhum dado vinculado a esse table_id foi encontrado!')

    resp = []
    for valor in dados:
        midia = API().buscar_por_id(valor[1], valor[0])
        midia = ConverterGenero(midia, True)
        resp.append(midia)

    return modelo_resposta(data=resp)
