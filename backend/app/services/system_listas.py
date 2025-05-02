from app.models import modelo_resposta
from app.services import DB_postgres as DB
from uuid import uuid4


# Adicionar
def adicionar_lista(dados: dict):
    query = 'INSERT INTO impacta.listas_usuario (user_id, table_id, table_nome) VALUES (%s, %s, %s);'
    try:
        resp = DB().modificar_banco(query, [dados['user_id'], str(uuid4()), dados['table_nome']])
        if not resp:
            return modelo_resposta(status="error", message="Registro repetido", error="O usuario já possui uma lista com o mesmo nome!", status_code=409)
        
        return modelo_resposta(message="Lista criada com sucesso!", status_code=201)
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar adicionar dado ao banco", error=err, status_code=500)


# Remover
def deletar_lista(dados: dict):
    query = "DELETE FROM impacta.listas_usuario WHERE user_id=%s AND table_id=%s;"
    try:
        DB().modificar_banco("DELETE FROM impacta.listas_registro WHERE table_id = %s;", [dados['table_id']])
        resp = DB().modificar_banco(query, [dados['user_id'], dados['table_id']])
        return modelo_resposta(data=resp, message="Lista deletada com sucesso!")
    except Exception as err:
        return modelo_resposta(status="error", message="Erro ao tentar remover dado ao banco", error=err, status_code=500)


# Ler
def buscar_lista(id_usuario: str):
    query = 'SELECT t.table_id, t.table_nome from impacta.listas_usuario t WHERE t.user_id = %s ;'
    dados = DB().buscar_banco(query, [id_usuario])
    if len(dados) == 0:
        return modelo_resposta(message='Nenhuma Lista encontrada', error='Nenhuma lista vinculada ao id de usuario foi encontrada')

    resp = []
    for lista in dados:
        resp.append({
            'table_id': lista[0],
            'table_nome': lista[1]
        })
    return modelo_resposta(data=resp)
