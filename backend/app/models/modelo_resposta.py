from flask import jsonify


def modelo_resposta(status="success", message="", data=None, error=None, status_code=200):
    """
        Gera uma resposta padronizada em formato JSON para as rotas da API.

        Esta função centraliza o formato das respostas retornadas pela API Flask, facilitando a consistência e
        a manutenção das mensagens e códigos HTTP.

        Args:
            status (str, optional): Indica o status da resposta. Pode ser "success" ou "error". Default: "success".
            message (str, optional): Mensagem de feedback explicando o resultado da operação. Default: "".
            data (any, optional): Dados a serem retornados, geralmente um dicionário ou lista. Default: None.
            error (any, optional): Detalhes do erro, caso aplicável. Pode ser uma string ou dicionário. Default: None.
            status_code (int, optional): Código HTTP da resposta. Default: 200.

        Returns:
            tuple: Um objeto JSON serializado pela função `jsonify()` e o código de status HTTP.
    """
    modelo = {
        "status": status,
        "message": message,
        "data": data,
        "errors": error
    }
    return jsonify(modelo), status_code
