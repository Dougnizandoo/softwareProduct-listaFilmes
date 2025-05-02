from app.models import modelo_resposta


def ValidarJSON(dados: dict, chaves_obrigatorias: dict) -> tuple | bool:
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Campos chave em falta", error=f'Os seguintes campos devem estar presentes no arquivo: {chaves_obrigatorias}', status_code=400)

    for chave in chaves_obrigatorias:
        if not dados[chave] or not str(dados[chave]).strip():
            return modelo_resposta(status="error", message="Chave sem valor", error=f'A chave: {chave} não pode ser um valor nulo!', status_code=400)
    
    return True
