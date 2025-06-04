from app.models import modelo_resposta


def str_para_int(converter: str, para: tuple | list, campo: int) -> int | dict:
    """
        Metodo para converter string para int.

        Args:
            converter (str): string que deseja converter
            para (tuple | list): uma tupla ou uma lista com os valores desejados
            campo (int): posição que está sendo convertido
        Returns:
            int | dict: retorna um numero inteiro caso a string passada esteja entre os valores desejados.
    """
    if converter not in para:
        return modelo_resposta(status='error', message='Valor invalido', error=f'O valor do {campo}º campo tem que está entre os valores: {para}', status_code=400)
    converter = int(converter)
    return converter
