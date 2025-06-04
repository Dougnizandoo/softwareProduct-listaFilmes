def converter_data(data: str) -> str:
    """
        Metodo para formatar a data recebida pelo banco.

        Args:
            data (str): Data do banco em formato de string.
        Returns:
            str: Retorna a data convertida.
    """
    cover = data.split("-")
    resp = str(f'{cover[2]}/{cover[1]}/{cover[0]}')
    return resp
