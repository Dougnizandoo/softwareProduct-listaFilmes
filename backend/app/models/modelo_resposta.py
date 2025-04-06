from flask import jsonify


def modelo_resposta(status="success", message="", data=None, error=None, status_code=200):
    modelo = {
        "status": status,
        "message": message,
        "data": data,
        "errors": error
    }
    return jsonify(modelo), status_code
