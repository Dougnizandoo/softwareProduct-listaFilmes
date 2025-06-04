def remover_campos(dici: dict, campos: list) -> dict:
    """
        Metodo para remover campos indesejados de um dicionario.

        Args:
            dici (dict): Dicionario que deseja remover os campos.
            campos (list): lista com as chaves que deseja excluir
        Returns:
            dict: Retorna o dicionario sem os campos excluidos.
    """
    for chave in list(dici.keys()):
        if chave in campos:
            dici.pop(chave)
    return dici
