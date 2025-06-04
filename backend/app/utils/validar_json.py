from app.models import modelo_resposta


def ValidarJSON(dados: dict, chaves_obrigatorias: dict) -> tuple | bool:
    """
        Valida se um dicionário contém todas as chaves obrigatórias e se essas chaves possuem valores válidos.

        Essa função é utilizada para validar a estrutura e o conteúdo de um JSON recebido em requisições, garantindo que os campos essenciais estejam presentes
        e preenchidos corretamente.

        Args:
            dados (dict): Dicionário contendo os dados recebidos na requisição.
            chaves_obrigatorias (set): Conjunto de chaves obrigatórias que devem estar presentes no dicionário `dados`.

        Returns:
                bool|tuple: 
                - `True` se a validação for bem-sucedida.
                - Uma `tuple` com `jsonify`, mensagem de erro e `status_code` caso falte alguma chave ou haja valor nulo em alguma delas.
    """
    if not chaves_obrigatorias.issubset(dados):
        return modelo_resposta(status="error", message="Campos chave em falta", error=f'Os seguintes campos devem estar presentes no arquivo: {chaves_obrigatorias}', status_code=400)

    for chave in chaves_obrigatorias:
        if not dados[chave] or not str(dados[chave]).strip():
            return modelo_resposta(status="error", message="Chave sem valor", error=f'A chave: {chave} não pode ser um valor nulo!', status_code=400)
    
    return True
